import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000;

async function getDocumentContent(supabase: any, filename: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .storage
      .from('policy-documents')
      .download(`airbnb docs/${filename}`);
    
    if (error) {
      console.error(`Error fetching ${filename}:`, error);
      return '';
    }

    const text = await data.text();
    return text;
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return '';
  }
}

async function buildSystemPrompt(supabase: any): Promise<string> {
  const documents = [
    'airbnb_reviews_policy.txt',
    'airbnb_content_policy.txt',
    'airbnb_community_standards.txt',
    'airbnb_terms_of_service.txt'
  ];

  const documentContents = await Promise.all(
    documents.map(doc => getDocumentContent(supabase, doc))
  );

  return `You are an expert on Airbnbs terms of service and professional communication best practices. Your only job is to work on behalf of the Airbnb host to help them respond to guest reviews.

Reference Documents:
Reviews Policy: ${documentContents[0]}
Content Policy: ${documentContents[1]}
Community Standards: ${documentContents[2]}
Terms of Service: ${documentContents[3]}

Context:
You are an expert on Airbnbs terms of service and professional communication best practices. Your only job is to work on behalf of the Airbnb host to help them respond to guest reviews. The host will provide you with:
The Guests first Name (to personalize your review response)
A copy of the guests review. 
Any additional context that is necessary. 

Process:
1. First, determine if the sentiment is positive or negative.

For positive reviews:
- Personalize using reviewer's name
- Reference specific details from the review
- Express gratitude
- Be brief but meaningful
- Encourage future engagement

For negative reviews:
1. Analyze for policy violations by cross-referencing:
   - Airbnb Reviews Policy
   - Content Policy
   - Community Standards
   - Terms of Service
2. If violations found:
   - Cite specific violated sections
   - Provide action plan for removal
   - Provide support agent script
3. If no violations:
   - Clearly state no violations found
   - Provide 2 professional response versions
   - Focus on improvements without being defensive
   - Address concerns professionally
   - Reassure future guests

Remember to maintain professionalism and empathy in all responses.`;
}

async function callOpenAIWithRetry(message: string, systemPrompt: string, retryCount = 0): Promise<Response> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not found');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const backoffTime = INITIAL_BACKOFF * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${backoffTime}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return callOpenAIWithRetry(message, systemPrompt, retryCount + 1);
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 429) {
        throw new Error('We are experiencing high demand. Please try again in a few moments.');
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message } = await req.json();
    console.log('Received message:', message);

    // Build system prompt with document references
    const systemPrompt = await buildSystemPrompt(supabaseClient);
    console.log('System prompt built successfully');

    const response = await callOpenAIWithRetry(message, systemPrompt);
    const data = await response.json();
    console.log('OpenAI API response received successfully');

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    const errorMessage = error.message || 'There was an error processing your request';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.toString()
      }),
      {
        status: error.message.includes('high demand') ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});