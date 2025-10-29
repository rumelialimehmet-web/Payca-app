import React, { useState, useEffect } from 'react';
import {
  CurrencyCode,
  convertCurrency,
  getCurrencySymbol,
  formatCurrencyAmount,
} from '../lib/currency-exchange';

export interface CurrencyBalance {
  currency: CurrencyCode;
  amount: number;
}

export interface MultiCurrencyBalanceProps {
  balances: CurrencyBalance[];
  preferredCurrency?: CurrencyCode;
  showConversion?: boolean;
}

export function MultiCurrencyBalance({
  balances,
  preferredCurrency = 'TRY',
  showConversion = true,
}: MultiCurrencyBalanceProps) {
  const [convertedTotal, setConvertedTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Calculate total in preferred currency
  useEffect(() => {
    if (!showConversion || balances.length === 0) {
      setConvertedTotal(null);
      return;
    }

    const calculateTotal = async () => {
      setLoading(true);
      let total = 0;

      for (const balance of balances) {
        if (balance.currency === preferredCurrency) {
          total += balance.amount;
        } else {
          const { convertedAmount, error } = await convertCurrency(
            Math.abs(balance.amount),
            balance.currency,
            preferredCurrency
          );
          if (!error) {
            total += balance.amount < 0 ? -convertedAmount : convertedAmount;
          }
        }
      }

      setConvertedTotal(total);
      setLoading(false);
    };

    calculateTotal();
  }, [balances, preferredCurrency, showConversion]);

  if (balances.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary dark:text-gray-400">
        Henüz harcama yok
      </div>
    );
  }

  // Group positive and negative balances
  const debts = balances.filter(b => b.amount < 0);
  const credits = balances.filter(b => b.amount > 0);
  const neutral = balances.filter(b => b.amount === 0);

  return (
    <div className="space-y-4">
      {/* Total in Preferred Currency */}
      {showConversion && convertedTotal !== null && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Toplam Bakiye</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrencyAmount(Math.abs(convertedTotal), preferredCurrency)}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {convertedTotal >= 0 ? 'Alacaklısınız' : 'Borçlusunuz'}
              </p>
            </div>
            <div className="text-right">
              <span className="material-symbols-outlined text-5xl opacity-20">
                account_balance_wallet
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Currency Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-border-color dark:border-gray-700">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="font-semibold text-text-primary dark:text-gray-200">
            Para Birimine Göre Bakiye
          </h3>
          <span className="material-symbols-outlined text-text-secondary dark:text-gray-400">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {expanded && (
          <div className="mt-4 space-y-3">
            {/* Credits */}
            {credits.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2">
                  Alacaklar
                </p>
                {credits.map((balance) => (
                  <div
                    key={balance.currency}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getCurrencySymbol(balance.currency)}
                      </span>
                      <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                        {balance.currency}
                      </span>
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      +{formatCurrencyAmount(balance.amount, balance.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Debts */}
            {debts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2">
                  Borçlar
                </p>
                {debts.map((balance) => (
                  <div
                    key={balance.currency}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getCurrencySymbol(balance.currency)}
                      </span>
                      <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                        {balance.currency}
                      </span>
                    </div>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {formatCurrencyAmount(balance.amount, balance.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Neutral */}
            {neutral.length > 0 && (
              <div>
                <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2">
                  Kapalı
                </p>
                {neutral.map((balance) => (
                  <div
                    key={balance.currency}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getCurrencySymbol(balance.currency)}
                      </span>
                      <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                        {balance.currency}
                      </span>
                    </div>
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      {formatCurrencyAmount(0, balance.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-2">
          <span className="text-sm text-text-secondary dark:text-gray-400">
            Kurlar güncelleniyor...
          </span>
        </div>
      )}
    </div>
  );
}

export default MultiCurrencyBalance;
