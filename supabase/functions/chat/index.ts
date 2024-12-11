import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    // Initialize OpenAI client
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // System prompt for GuestReview Genius
    const systemPrompt = `You are GuestReview Genius, an AI assistant specialized in helping Airbnb hosts craft professional and effective responses to guest reviews. Your goal is to help hosts maintain high ratings and build trust with potential guests.

Guidelines for responses:
1. Always maintain a professional and courteous tone
2. Address specific points mentioned in the review
3. Show appreciation for positive feedback
4. Handle criticism constructively and professionally
5. Keep responses concise but thorough
6. Focus on solutions and improvements
7. End with a positive note that encourages future bookings`

    // Generate response using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",  // Updated to use the recommended model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.data.choices[0].message?.content || "I apologize, but I couldn't generate a response. Please try again."

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: 'There was an error processing your request' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})