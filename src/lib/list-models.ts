/**
 * List available Gemini models for the API key
 * This will show us which models actually work
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

// Test available models
export async function listAvailableModels() {
    if (!API_KEY) {
        console.error('No API key configured');
        return;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        const data = await response.json();
        console.log('=== AVAILABLE GEMINI MODELS ===');
        console.log('Full response:', data);

        if (data.models) {
            console.log('\nSupported models:');
            data.models.forEach((model: any) => {
                console.log(`- ${model.name}`);
                console.log(`  Display name: ${model.displayName}`);
                console.log(`  Methods: ${model.supportedGenerationMethods?.join(', ')}`);
            });
        }

        return data;
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

// Call this immediately to see available models
if (typeof window !== 'undefined') {
    listAvailableModels();
}
