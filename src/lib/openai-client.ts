/**
 * OpenAI ChatGPT Client - Secure AI Integration via Supabase Edge Functions
 * Using GPT-4o for vision (receipt scanning) and GPT-4o-mini for text (financial advice)
 *
 * SECURITY: API calls are proxied through Supabase Edge Functions to keep API keys secure
 */

import { supabase } from './supabase';

const USE_EDGE_FUNCTION = true; // Set to false for local development with direct API access
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-proxy`
    : null;

if (!EDGE_FUNCTION_URL && USE_EDGE_FUNCTION) {
    console.warn('⚠️ Supabase URL not configured. AI features will be disabled.');
}

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
    if (!EDGE_FUNCTION_URL || !supabase) {
        return {
            success: false,
            error: 'AI özelliği yapılandırılmamış. Lütfen yöneticinizle iletişime geçin.',
        };
    }

    try {
        console.log('[OpenAI Proxy] Scanning receipt via secure Edge Function...');

        // Ensure image data has proper data URL format
        let formattedImageData = imageData;
        if (!imageData.startsWith('data:')) {
            formattedImageData = `data:image/jpeg;base64,${imageData}`;
        }

        console.log('[OpenAI Proxy] Image data length:', formattedImageData.length);

        // Get current session token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('Lütfen önce giriş yapın');
        }

        // Call Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('openai-proxy', {
            body: {
                type: 'scan-receipt',
                imageData: formattedImageData
            }
        });

        if (error) {
            console.error('[OpenAI Proxy] Error:', error);
            throw new Error(error.message || 'Fatura tarama başarısız oldu');
        }

        console.log('[OpenAI Proxy] Receipt scanned successfully');

        return data;
    } catch (error: any) {
        console.error('[OpenAI Proxy] Receipt scanning error:', error);

        // User-friendly error messages
        let errorMessage = 'Fatura tarama başarısız oldu. Lütfen tekrar deneyin.';
        if (error.message?.includes('giriş')) {
            errorMessage = error.message;
        } else if (error.message?.includes('quota')) {
            errorMessage = 'AI servisi kotası dolmuş. Lütfen daha sonra tekrar deneyin.';
        } else if (error.message?.includes('network')) {
            errorMessage = 'İnternet bağlantısı hatası. Bağlantınızı kontrol edin.';
        }

        return {
            success: false,
            error: errorMessage,
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
    if (!EDGE_FUNCTION_URL || !supabase) {
        return {
            success: false,
            error: 'AI özelliği yapılandırılmamış.',
        };
    }

    try {
        console.log('[OpenAI Proxy] Getting financial advice via secure Edge Function...');

        // Get current session token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('Lütfen önce giriş yapın');
        }

        // Call Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('openai-proxy', {
            body: {
                type: 'financial-advice',
                groups,
                userId
            }
        });

        if (error) {
            console.error('[OpenAI Proxy] Error:', error);
            throw new Error(error.message || 'Finansal danışmanlık başarısız oldu');
        }

        console.log('[OpenAI Proxy] Financial advice received');

        return data;
    } catch (error: any) {
        console.error('[OpenAI Proxy] Financial advice error:', error);

        let errorMessage = 'Finansal danışmanlık başarısız oldu. Lütfen tekrar deneyin.';
        if (error.message?.includes('giriş')) {
            errorMessage = error.message;
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
}
