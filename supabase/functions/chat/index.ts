import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

async function callOpenAIWithRetry(message: string, retryCount = 0): Promise<Response> {
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are GuestReview Genius, an AI assistant specialized in helping Airbnb hosts craft professional and effective responses to guest reviews. Your goal is to help hosts maintain high ratings and build trust with potential guests.

Guidelines for responses:
1. Always maintain a professional and courteous tone
2. Address specific points mentioned in the review
3. Show appreciation for positive feedback
4. Handle criticism constructively and professionally
5. Keep responses concise but thorough
6. Focus on solutions and improvements
7. End with a positive note that encourages future bookings`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const backoffTime = INITIAL_BACKOFF * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${backoffTime}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return callOpenAIWithRetry(message, retryCount + 1);
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Received message:', message);

    const response = await callOpenAIWithRetry(message);
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