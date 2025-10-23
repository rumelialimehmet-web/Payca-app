import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('⚠️ Gemini API key not configured. Receipt scanning and AI features will be disabled.');
}

export const geminiClient = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Scan receipt image and extract expense data using Gemini Vision
 * @param imageData - Base64 encoded image data (JPEG, PNG, WebP)
 * @returns Extracted receipt data
 */
export async function scanReceipt(imageData: string): Promise<{
    success: boolean;
    data?: {
        amount?: number;
        date?: string; // YYYY-MM-DD
        merchantName?: string;
        category?: string;
        items?: Array<{ name: string; price: number }>;
    };
    error?: string;
}> {
    if (!geminiClient) {
        return {
            success: false,
            error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.',
        };
    }

    try {
        const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

        const imageParts = [
            {
                inlineData: {
                    data: imageData.split(',')[1] || imageData, // Remove data:image/... prefix if present
                    mimeType: 'image/jpeg', // mimeType'ı JPEG olarak varsayıyoruz, gerekirse dinamik hale getirebilirsiniz.
                },
            },
        ];

        // 'gemini-1.5-flash' gibi modern modeller metin ve resim girdilerini tek bir dizide kabul eder.
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        const text = response.text();

        // Parse JSON from response
        let jsonText = text.trim();

        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const receiptData = JSON.parse(jsonText);

        return {
            success: true,
            data: receiptData,
        };
    } catch (error: any) {
        console.error('Receipt scanning error:', error);
        return {
            success: false,
            error: error.message || 'Failed to scan receipt. Please try again.',
        };
    }
}

/**
 * Get AI financial advice based on spending patterns
 * @param groups - User's expense groups
 * @param userId - Current user ID
 * @returns AI-generated financial advice
 */
export async function getFinancialAdvice(
    groups: any[],
    userId: string
): Promise<{ success: boolean; advice?: string; error?: string }> {
    if (!geminiClient) {
        return {
            success: false,
            error: 'Gemini API key not configured.',
        };
    }

    try {
        const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

        const result = await model.generateContent(prompt);
        const response = result.response;
        const advice = response.text();

        return {
            success: true,
            advice: advice.trim(),
        };
    } catch (error: any) {
        console.error('Financial advice error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate advice.',
        };
    }
}
