/**
 * OpenAI ChatGPT Client - Reliable AI Integration
 * Using GPT-4o for vision (receipt scanning) and GPT-4o-mini for text (financial advice)
 */

import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.warn('⚠️ OpenAI API key not configured. AI features will be disabled.');
}

export const openai = API_KEY ? new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // For client-side usage
}) : null;

/**
 * Scan receipt using GPT-4o Vision
 * @param imageData - Base64 encoded image data
 * @returns Extracted receipt data
 */
export async function scanReceipt(imageData: string): Promise<{
    success: boolean;
    data?: {
        amount?: number;
        date?: string;
        merchantName?: string;
        category?: string;
        items?: Array<{ name: string; price: number }>;
    };
    error?: string;
}> {
    if (!openai) {
        return {
            success: false,
            error: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment.',
        };
    }

    try {
        console.log('[OpenAI] Scanning receipt with GPT-4o Vision...');

        // Ensure image data has proper data URL format
        let formattedImageData = imageData;
        if (!imageData.startsWith('data:')) {
            formattedImageData = `data:image/jpeg;base64,${imageData}`;
        }

        console.log('[OpenAI] Image data format:', formattedImageData.substring(0, 50) + '...');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `You are a receipt OCR scanner. Analyze this receipt image and extract the following information in JSON format:

{
  "amount": <total amount as number>,
  "date": <date in YYYY-MM-DD format>,
  "merchantName": <store/restaurant name>,
  "category": <one of: "food", "transport", "entertainment", "bills", "other">,
  "items": [
    { "name": "<item name>", "price": <price as number> }
  ]
}

Rules:
1. Only return valid JSON, no markdown formatting
2. If you can't find a field, use null
3. Amount and prices should be numbers (no currency symbols)
4. Category should be your best guess based on merchant name
5. If receipt is in Turkish, keep merchant and item names in Turkish
6. Parse common Turkish receipt formats (Migros, A101, BIM, CarrefourSA, etc.)

Example Turkish receipt categories:
- Supermarket/Market → "food"
- Restaurant/Café → "food"
- Taxi/Uber/Bus → "transport"
- Cinema/Concert → "entertainment"
- Electricity/Water/Internet → "bills"`
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
        });

        const text = response.choices[0]?.message?.content;
        if (!text) {
            throw new Error('No response from OpenAI');
        }

        console.log('[OpenAI] Receipt scan response:', text);

        // Parse JSON from response (remove markdown if present)
        let jsonText = text.trim();
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const receiptData = JSON.parse(jsonText);

        return {
            success: true,
            data: receiptData,
        };
    } catch (error: any) {
        console.error('[OpenAI] Receipt scanning error:', error);
        return {
            success: false,
            error: error.message || 'Failed to scan receipt. Please try again.',
        };
    }
}

/**
 * Get AI financial advice using GPT-4o-mini
 * @param groups - User's expense groups
 * @param userId - Current user ID
 * @returns AI-generated financial advice in Turkish
 */
export async function getFinancialAdvice(
    groups: any[],
    userId: string
): Promise<{ success: boolean; advice?: string; error?: string }> {
    if (!openai) {
        return {
            success: false,
            error: 'OpenAI API key not configured.',
        };
    }

    try {
        // Calculate total spending and category breakdown
        let totalSpending = 0;
        const categorySpending: Record<string, number> = {};

        groups.forEach((group) => {
            group.expenses?.forEach((expense: any) => {
                totalSpending += expense.amount;
                const category = expense.category || 'other';
                categorySpending[category] = (categorySpending[category] || 0) + expense.amount;
            });
        });

        console.log('[OpenAI] Getting financial advice with GPT-4o-mini...');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a friendly financial advisor for a Turkish expense tracking app called Payça. Always respond in Turkish with friendly, conversational language.'
                },
                {
                    role: 'user',
                    content: `Kullanıcının harcama özeti:
- Toplam harcama: ₺${totalSpending.toFixed(2)}
- Kategori dağılımı: ${JSON.stringify(categorySpending, null, 2)}
- Grup sayısı: ${groups.length}

Lütfen kişiselleştirilmiş finansal tavsiye ver:
1. Harcama alışkanlıklarını analiz et
2. Tasarruf edebilecekleri alanları belirle
3. 2-3 uygulanabilir ipucu ver
4. Teşvik edici ve pozitif ol
5. Kısa ve öz tut (maksimum 200 kelime)
6. Samimi, sohbet havası kullan

Resmi bir rapor değil, arkadaşça bir mesaj formatında yanıt ver.`
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        const advice = response.choices[0]?.message?.content;
        if (!advice) {
            throw new Error('No response from OpenAI');
        }

        console.log('[OpenAI] Financial advice received');

        return {
            success: true,
            advice: advice.trim(),
        };
    } catch (error: any) {
        console.error('[OpenAI] Financial advice error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate advice.',
        };
    }
}
