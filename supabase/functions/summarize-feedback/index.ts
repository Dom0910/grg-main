import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory cache with timestamp
const cache = new Map<string, { summary: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function generateSummary(feedbackData: any) {
  // Generate a cache key based on the feedback data
  const cacheKey = JSON.stringify(feedbackData);
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    console.log('Returning cached summary');
    return cachedData.summary;
  }

  // Implement exponential backoff for retries
  const maxRetries = 3;
  let delay = 1000; // Start with 1 second delay

  for (let attempt = 0; attempt < maxRetries; attempt++) {
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
              content: 'You are an AI assistant that analyzes customer feedback and survey responses. Provide a concise summary of the key insights, trends, and patterns from the data.'
            },
            {
              role: 'user',
              content: `Please analyze and summarize this feedback data: ${JSON.stringify(feedbackData)}`
            }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Attempt ${attempt + 1} failed:`, errorText);
        
        if (response.status === 429) {
          // If rate limited, wait longer before retry
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double the delay for next attempt
          continue;
        }
        
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const summary = data.choices[0].message.content;
      
      // Cache the successful response
      cache.set(cacheKey, { summary, timestamp: Date.now() });
      
      return summary;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedbackData } = await req.json();
    console.log('Received feedback data:', feedbackData);

    const summary = await generateSummary(feedbackData);
    console.log('Generated or retrieved summary:', summary);

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in summarize-feedback function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'The service is temporarily unavailable. Please try again in a few minutes.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});