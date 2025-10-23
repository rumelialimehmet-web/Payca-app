/**
 * Gemini REST API - Direct API calls without SDK
 * This bypasses SDK version issues and gives us full control
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('⚠️ Gemini API key not configured. AI features will be disabled.');
}

/**
 * Scan receipt using Gemini Vision API (REST)
 * Uses v1 API with gemini-1.5-flash model
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
    if (!API_KEY) {
        return {
            success: false,
            error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment.',
        };
    }

    try {
        // Remove data:image/... prefix if present
        const base64Image = imageData.includes(',') ? imageData.split(',')[1] : imageData;

        // Use v1beta API with gemini-1.5-flash-latest (stable model name)
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

        const prompt = `You are a receipt OCR scanner. Analyze this receipt image and extract the following information in JSON format:

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
5. If receipt is in Turkish, translate merchant and item names to Turkish
6. Parse common Turkish receipt formats (Migros, A101, BIM, CarrefourSA, etc.)

Example Turkish receipt categories:
- Supermarket/Market → "food"
- Restaurant/Café → "food"
- Taxi/Uber/Bus → "transport"
- Cinema/Concert → "entertainment"
- Electricity/Water/Internet → "bills"`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Image
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
            }
        };

        console.log('[Gemini REST] Calling v1 API for receipt scanning...');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Gemini REST] API Error:', response.status, errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('[Gemini REST] Response received:', data);

        // Extract text from response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error('No text in API response');
        }

        // Parse JSON from response (remove markdown if present)
        let jsonText = text.trim();
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const receiptData = JSON.parse(jsonText);

        return {
            success: true,
            data: receiptData,
        };
    } catch (error: any) {
        console.error('[Gemini REST] Receipt scanning error:', error);
        return {
            success: false,
            error: error.message || 'Failed to scan receipt. Please try again.',
        };
    }
}

/**
 * Get AI financial advice using Gemini API (REST)
 * Uses v1 API with gemini-1.5-flash model
 */
export async function getFinancialAdvice(
    groups: any[],
    userId: string
): Promise<{ success: boolean; advice?: string; error?: string }> {
    if (!API_KEY) {
        return {
            success: false,
            error: 'Gemini API key not configured.',
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

        const prompt = `You are a friendly financial advisor for a Turkish expense tracking app called Payça.

User's spending summary:
- Total spending: ₺${totalSpending.toFixed(2)}
- Category breakdown: ${JSON.stringify(categorySpending, null, 2)}
- Number of groups: ${groups.length}

Provide personalized financial advice in Turkish:
1. Analyze spending patterns
2. Identify areas where they can save money
3. Give 2-3 actionable tips
4. Be encouraging and positive
5. Keep it concise (max 200 words)
6. Use friendly, conversational Turkish

Format as a friendly message, not a formal report.`;

        // Use v1beta API with gemini-1.5-flash-latest (stable model name)
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        console.log('[Gemini REST] Calling v1 API for financial advice...');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Gemini REST] API Error:', response.status, errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('[Gemini REST] Response received:', data);

        // Extract text from response
        const advice = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!advice) {
            throw new Error('No text in API response');
        }

        return {
            success: true,
            advice: advice.trim(),
        };
    } catch (error: any) {
        console.error('[Gemini REST] Financial advice error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate advice.',
        };
    }
}
