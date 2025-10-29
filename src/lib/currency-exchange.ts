/**
 * Currency Exchange Service
 * Using Frankfurter API - Free, no API key required, no limits
 * https://frankfurter.dev/
 */

// Supported currencies
export const SUPPORTED_CURRENCIES = {
  TRY: { code: 'TRY', symbol: '₺', name: 'Türk Lirası' },
  USD: { code: 'USD', symbol: '$', name: 'ABD Doları' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'İngiliz Sterlini' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japon Yeni' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'İsviçre Frangı' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Kanada Doları' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Avustralya Doları' },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

const FRANKFURTER_API_BASE = 'https://api.frankfurter.app';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

// Cache structure
interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
  base: CurrencyCode;
}

// In-memory cache
const ratesCache = new Map<CurrencyCode, CachedRates>();

/**
 * Fetch latest exchange rates from Frankfurter API
 */
export async function fetchExchangeRates(
  baseCurrency: CurrencyCode = 'EUR'
): Promise<{ rates: Record<string, number>; error?: string }> {
  // Check cache first
  const cached = ratesCache.get(baseCurrency);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { rates: cached.rates };
  }

  try {
    const symbols = Object.keys(SUPPORTED_CURRENCIES).join(',');
    const url = `${FRANKFURTER_API_BASE}/latest?from=${baseCurrency}&to=${symbols}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the results
    const cacheEntry: CachedRates = {
      rates: data.rates,
      timestamp: Date.now(),
      base: baseCurrency,
    };
    ratesCache.set(baseCurrency, cacheEntry);

    return { rates: data.rates };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {
      rates: {},
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<{ convertedAmount: number; rate: number; error?: string }> {
  // Same currency - no conversion needed
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, rate: 1 };
  }

  try {
    const url = `${FRANKFURTER_API_BASE}/latest?from=${fromCurrency}&to=${toCurrency}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rate = data.rates[toCurrency];

    if (!rate) {
      throw new Error(`Dönüşüm kursu bulunamadı: ${fromCurrency} -> ${toCurrency}`);
    }

    const convertedAmount = amount * rate;

    return {
      convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimals
      rate,
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    return {
      convertedAmount: 0,
      rate: 0,
      error: error instanceof Error ? error.message : 'Dönüşüm hatası',
    };
  }
}

/**
 * Get historical exchange rates for a specific date
 */
export async function getHistoricalRates(
  date: string, // Format: YYYY-MM-DD
  baseCurrency: CurrencyCode = 'EUR'
): Promise<{ rates: Record<string, number>; date: string; error?: string }> {
  try {
    const symbols = Object.keys(SUPPORTED_CURRENCIES).join(',');
    const url = `${FRANKFURTER_API_BASE}/${date}?from=${baseCurrency}&to=${symbols}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      rates: data.rates,
      date: data.date,
    };
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    return {
      rates: {},
      date,
      error: error instanceof Error ? error.message : 'Geçmiş kur hatası',
    };
  }
}

/**
 * Get time series data for currency trends
 */
export async function getCurrencyTimeSeries(
  fromDate: string, // Format: YYYY-MM-DD
  toDate: string, // Format: YYYY-MM-DD
  baseCurrency: CurrencyCode = 'EUR',
  targetCurrency: CurrencyCode
): Promise<{ series: Record<string, number>; error?: string }> {
  try {
    const url = `${FRANKFURTER_API_BASE}/${fromDate}..${toDate}?from=${baseCurrency}&to=${targetCurrency}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the data: { "2024-01-01": { "USD": 1.09 }, ... }
    const series: Record<string, number> = {};
    for (const [date, rates] of Object.entries(data.rates)) {
      series[date] = (rates as any)[targetCurrency];
    }

    return { series };
  } catch (error) {
    console.error('Error fetching time series:', error);
    return {
      series: {},
      error: error instanceof Error ? error.message : 'Zaman serisi hatası',
    };
  }
}

/**
 * Format currency amount with symbol
 */
export function formatCurrencyAmount(
  amount: number,
  currency: CurrencyCode
): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  if (!currencyInfo) return `${amount.toFixed(2)}`;

  // Format based on locale
  if (currency === 'TRY') {
    return `${amount.toFixed(2)} ${currencyInfo.symbol}`;
  } else {
    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[currency]?.symbol || currency;
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[currency]?.name || currency;
}

/**
 * Clear exchange rates cache
 */
export function clearRatesCache(): void {
  ratesCache.clear();
}

/**
 * Get all cached rates (for debugging)
 */
export function getCachedRates(): Map<CurrencyCode, CachedRates> {
  return new Map(ratesCache);
}
