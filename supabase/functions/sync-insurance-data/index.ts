import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sample insurance providers
    const sampleProviders = [
      {
        name: "TruckShield Insurance",
        company_name: "TruckShield Corp",
        description: "Specialized truck and commercial vehicle insurance with 24/7 roadside assistance.",
        rating: 4.8,
        coverage_areas: ["US", "CA"],
        specializes_in: ["trucks", "commercial", "SUVs"]
      },
      {
        name: "OffRoad Coverage Plus",
        company_name: "OffRoad Insurance Group",
        description: "Premium off-road vehicle insurance with adventure coverage.",
        rating: 4.6,
        coverage_areas: ["US"],
        specializes_in: ["SUVs", "pickup", "off-road"]
      }
    ]

    // Sample insurance quotes
    const sampleQuotes = [
      {
        vehicle_type: "truck",
        coverage_type: "comprehensive",
        monthly_premium: 89.99,
        annual_premium: 1079.88,
        deductible: 500.00,
        coverage_limit: 100000.00,
        features: ["roadside_assistance", "rental_coverage", "gap_coverage"]
      },
      {
        vehicle_type: "SUV",
        coverage_type: "full",
        monthly_premium: 125.50,
        annual_premium: 1506.00,
        deductible: 250.00,
        coverage_limit: 250000.00,
        features: ["comprehensive", "collision", "liability", "uninsured_motorist"]
      }
    ]

    // Clear and insert data
    await supabaseClient.from('insurance_providers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('insurance_quotes').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const { data: providers } = await supabaseClient.from('insurance_providers').insert(sampleProviders).select()
    
    const quotesWithProviders = sampleQuotes.map((quote, index) => ({
      ...quote,
      provider_id: providers?.[index % providers.length]?.id
    }))

    await supabaseClient.from('insurance_quotes').insert(quotesWithProviders)

    return new Response(
      JSON.stringify({ success: true, message: 'Insurance data synced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})