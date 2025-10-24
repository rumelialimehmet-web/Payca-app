// ============================================
// PAYCA - OPENAI PROXY EDGE FUNCTION
// ============================================
// Copy this entire file and paste it into Supabase Dashboard
// Edge Functions → Create New Function → Name: openai-proxy
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get OpenAI API key from environment
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Verify authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { type, imageData, groups, userId } = await req.json()

    let response

    switch (type) {
      case 'scan-receipt':
        response = await scanReceipt(OPENAI_API_KEY, imageData)
        break

      case 'financial-advice':
        response = await getFinancialAdvice(OPENAI_API_KEY, groups, userId)
        break

      default:
        throw new Error('Invalid request type')
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function scanReceipt(apiKey, imageData) {
  console.log('[OpenAI Proxy] Scanning receipt with GPT-4o Vision...')

  // Ensure image data has proper format
  let formattedImageData = imageData
  if (!imageData.startsWith('data:')) {
    formattedImageData = `data:image/jpeg;base64,${imageData}`
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a receipt OCR scanner. Analyze this receipt image and extract the following information in JSON format:
{
  "merchantName": "Store name",
  "amount": total_amount_as_number,
  "date": "YYYY-MM-DD",
  "category": "food|transportation|entertainment|utilities|other",
  "items": [
    { "name": "item name", "price": price_as_number }
  ]
}

Important:
- Return ONLY valid JSON, no markdown or explanations
- Use Turkish characters if needed (ş, ğ, ı, ü, ö, ç)
- If you can't read something, use null
- Amount must be a number without currency symbols
- Date should be ISO format (YYYY-MM-DD)
- Category must be one of: food, transportation, entertainment, utilities, other`
            },
            {
              type: 'image_url',
              image_url: {
                url: formattedImageData
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.2
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content in OpenAI response')
  }

  // Parse JSON response
  const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const receiptData = JSON.parse(jsonText)

  return {
    success: true,
    data: receiptData
  }
}

async function getFinancialAdvice(apiKey, groups, userId) {
  console.log('[OpenAI Proxy] Getting financial advice with GPT-4o-mini...')

  // Calculate user's spending summary
  const totalSpending = groups.reduce((sum, group) => {
    const groupTotal = group.expenses.reduce((s, e) => s + e.amount, 0)
    return sum + groupTotal / (group.members?.length || 1)
  }, 0)

  const categoryBreakdown = {}
  groups.forEach(group => {
    group.expenses.forEach((expense) => {
      const category = expense.category || 'other'
      const userShare = expense.amount / (group.members?.length || 1)
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + userShare
    })
  })

  const prompt = `Kullanıcının harcama özeti:
Toplam harcama: ${totalSpending.toFixed(2)} TL
Grup sayısı: ${groups.length}
Kategori dağılımı: ${JSON.stringify(categoryBreakdown, null, 2)}

Lütfen kullanıcıya:
1. Harcama alışkanlıkları hakkında kısa bir analiz yap
2. 2-3 pratik tasarruf önerisi sun
3. Pozitif ve destekleyici bir dille yaz
4. Maksimum 200 kelime ile sınırlı tut

Türkçe olarak yanıtla.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly financial advisor who helps people manage their group expenses and save money. Always respond in Turkish.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const advice = data.choices[0]?.message?.content

  if (!advice) {
    throw new Error('No advice in OpenAI response')
  }

  return {
    success: true,
    advice: advice
  }
}
