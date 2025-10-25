import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('[Gemini] API key not found. AI features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Receipt Data Interface
 */
export interface ReceiptData {
    merchantName: string | null;
    amount: number | null;
    date: string | null;
    category: string | null;
    items: Array<{
        name: string;
        price: number;
    }>;
}

export interface ScanReceiptResponse {
    success: boolean;
    data?: ReceiptData;
    error?: string;
}

export interface FinancialAdviceResponse {
    success: boolean;
    advice?: string;
    error?: string;
}

/**
 * Convert base64 image to format Gemini expects
 */
function base64ToGenerativePart(base64Data: string, mimeType: string = 'image/jpeg') {
    // Remove data URL prefix if present
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    return {
        inlineData: {
            data: base64,
            mimeType
        }
    };
}

/**
 * Scan receipt using Gemini Vision API
 */
export async function scanReceipt(imageData: string): Promise<ScanReceiptResponse> {
    if (!genAI) {
        return {
            success: false,
            error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to .env.local'
        };
    }

    try {
        console.log('[Gemini] Scanning receipt with gemini-2.5-flash...');

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        // Prepare image part
        const imagePart = base64ToGenerativePart(imageData);

        // Prepare text prompt
        const textPart = `Analyze this receipt image and extract the following information in JSON format:
{
  "merchantName": "Store name",
  "amount": total_amount_as_number,
  "date": "YYYY-MM-DD",
  "category": "food|transportation|entertainment|utilities|bills|rent|shopping|health|education|other",
  "items": [
    { "name": "item name", "price": price_as_number }
  ]
}

Important rules:
- Return ONLY valid JSON, no markdown or explanations
- Use Turkish characters if needed (ş, ğ, ı, ü, ö, ç)
- If you can't read something, use null
- Amount must be a number without currency symbols
- Date should be ISO format (YYYY-MM-DD), if not visible use today's date
- Category must be one of: food, transportation, entertainment, utilities, bills, rent, shopping, health, education, other
- Extract all visible line items with their prices
- merchantName should be the store/restaurant name`;

        // Generate content with vision
        const result = await model.generateContent([textPart, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log('[Gemini] Raw response:', text);

        // Parse JSON response (remove markdown if present)
        const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const receiptData: ReceiptData = JSON.parse(jsonText);

        console.log('[Gemini] Parsed receipt data:', receiptData);

        return {
            success: true,
            data: receiptData
        };

    } catch (error: any) {
        console.error('[Gemini] Receipt scan error:', error);
        return {
            success: false,
            error: error.message || 'Fatura tarama başarısız oldu'
        };
    }
}

/**
 * Get financial advice using Gemini
 */
export async function getFinancialAdvice(
    groups: any[],
    userId: string
): Promise<FinancialAdviceResponse> {
    if (!genAI) {
        return {
            success: false,
            error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to .env.local'
        };
    }

    try {
        console.log('[Gemini] Getting financial advice with gemini-2.5-flash...');

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        // Calculate user's spending summary
        const totalSpending = groups.reduce((sum, group) => {
            const groupTotal = group.expenses.reduce((s: number, e: any) => s + e.amount, 0);
            return sum + groupTotal / (group.members?.length || 1);
        }, 0);

        const categoryBreakdown: Record<string, number> = {};
        groups.forEach(group => {
            group.expenses.forEach((expense: any) => {
                const category = expense.category || 'other';
                const userShare = expense.amount / (group.members?.length || 1);
                categoryBreakdown[category] = (categoryBreakdown[category] || 0) + userShare;
            });
        });

        // Create prompt
        const prompt = `Kullanıcının harcama özeti:
Toplam harcama: ${totalSpending.toFixed(2)} TL
Grup sayısı: ${groups.length}
Kategori dağılımı:
${Object.entries(categoryBreakdown)
    .map(([cat, amount]) => `- ${cat}: ${amount.toFixed(2)} TL`)
    .join('\n')}

Lütfen kullanıcıya:
1. Harcama alışkanlıkları hakkında kısa bir analiz yap
2. 2-3 pratik tasarruf önerisi sun
3. Pozitif ve destekleyici bir dille yaz
4. Maksimum 200 kelime ile sınırlı tut

Türkçe olarak yanıtla.`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const advice = response.text();

        console.log('[Gemini] Financial advice generated');

        return {
            success: true,
            advice
        };

    } catch (error: any) {
        console.error('[Gemini] Financial advice error:', error);
        return {
            success: false,
            error: error.message || 'Finansal tavsiye alınamadı'
        };
    }
}

/**
 * Check if Gemini is available
 */
export function isGeminiAvailable(): boolean {
    return genAI !== null;
}
