import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting rally data sync...')

    // Sample rally clubs data (in production, this would come from real APIs)
    const sampleClubs = [
      {
        name: "Rally Australia",
        location: "Melbourne",
        country: "Australia",
        description: "Premier rally club organizing events across Australia's diverse terrain.",
        website_url: "https://rallyaustralia.com.au",
        contact_email: "info@rallyaustralia.com.au",
        club_type: "rally",
        founded_year: 1988,
        member_count: 450,
        image_url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop"
      },
      {
        name: "European Rally Championship",
        location: "Various",
        country: "Europe",
        description: "Continental championship featuring the best rally teams across Europe.",
        website_url: "https://www.eurorally.com",
        contact_email: "contact@eurorally.com",
        club_type: "championship",
        founded_year: 1953,
        member_count: 2500,
        image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop"
      },
      {
        name: "American Rally Association",
        location: "Colorado Springs",
        country: "United States",
        description: "Leading rally organization promoting motorsport across North America.",
        website_url: "https://americanrallyassociation.org",
        contact_email: "info@americanrallyassociation.org",
        club_type: "rally",
        founded_year: 1975,
        member_count: 1200,
        image_url: "https://images.unsplash.com/photo-1592853625511-ad0bbf75549b?w=800&h=600&fit=crop"
      }
    ]

    // Sample rally events data
    const sampleEvents = [
      {
        title: "Desert Storm Rally 2025",
        description: "Epic desert rally featuring challenging terrain and spectacular scenery.",
        event_type: "rally",
        start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        end_date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Mojave Desert",
        country: "United States",
        venue: "Barstow Rally Center",
        entry_fee: 2500.00,
        max_participants: 150,
        current_participants: 87,
        external_url: "https://desertstormrally.com",
        image_url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
        difficulty_level: "advanced",
        terrain_type: "gravel"
      },
      {
        title: "Alpine Challenge 2025",
        description: "Mountain rally through the scenic Alps with technical stages.",
        event_type: "competition",
        start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Swiss Alps",
        country: "Switzerland",
        venue: "Interlaken Rally Base",
        entry_fee: 1800.00,
        max_participants: 100,
        current_participants: 65,
        external_url: "https://alpinechallenge.ch",
        image_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        difficulty_level: "professional",
        terrain_type: "tarmac"
      },
      {
        title: "Forest Rally Championship",
        description: "Fast-paced forest stages for experienced rally drivers.",
        event_type: "championship",
        start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Scottish Highlands",
        country: "United Kingdom",
        venue: "Highland Rally Center",
        entry_fee: 1200.00,
        max_participants: 80,
        current_participants: 45,
        external_url: "https://forestrally.uk",
        image_url: "https://images.unsplash.com/photo-1592853625511-ad0bbf75549b?w=800&h=600&fit=crop",
        difficulty_level: "intermediate",
        terrain_type: "mixed"
      }
    ]

    // Clear existing data and insert new data
    await supabaseClient.from('clubs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert clubs
    const { error: clubsError } = await supabaseClient
      .from('clubs')
      .insert(sampleClubs)

    if (clubsError) {
      console.error('Error inserting clubs:', clubsError)
      throw clubsError
    }

    // Get club IDs for events
    const { data: clubs } = await supabaseClient
      .from('clubs')
      .select('id')
      .limit(sampleEvents.length)

    // Add club_id to events
    const eventsWithClubs = sampleEvents.map((event, index) => ({
      ...event,
      club_id: clubs?.[index]?.id || null
    }))

    // Insert events
    const { error: eventsError } = await supabaseClient
      .from('events')
      .insert(eventsWithClubs)

    if (eventsError) {
      console.error('Error inserting events:', eventsError)
      throw eventsError
    }

    console.log(`Successfully synced ${sampleClubs.length} clubs and ${sampleEvents.length} events`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${sampleClubs.length} clubs and ${sampleEvents.length} events` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in sync-rally-data function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})