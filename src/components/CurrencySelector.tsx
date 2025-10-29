import React, { useState, useEffect } from 'react';
import {
  SUPPORTED_CURRENCIES,
  CurrencyCode,
  getCurrencySymbol,
  getCurrencyName,
  convertCurrency,
} from '../lib/currency-exchange';

export interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  amount?: number;
  showConversion?: boolean;
  targetCurrency?: CurrencyCode;
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  amount,
  showConversion = false,
  targetCurrency = 'TRY',
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-convert when amount or currency changes
  useEffect(() => {
    if (showConversion && amount && selectedCurrency !== targetCurrency) {
      setLoading(true);
      convertCurrency(amount, selectedCurrency, targetCurrency)
        .then(({ convertedAmount, error }) => {
          if (!error) {
            setConvertedAmount(convertedAmount);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setConvertedAmount(null);
    }
  }, [amount, selectedCurrency, targetCurrency, showConversion]);

  const handleSelect = (currency: CurrencyCode) => {
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  const currencyList = Object.entries(SUPPORTED_CURRENCIES);

  return (
    <div className="relative">
      {/* Selected Currency Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 w-full p-3 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-primary dark:text-blue-400">
            {getCurrencySymbol(selectedCurrency)}
          </span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-text-primary dark:text-gray-200">
              {selectedCurrency}
            </span>
            <span className="text-xs text-text-secondary dark:text-gray-400">
              {getCurrencyName(selectedCurrency)}
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-text-secondary dark:text-gray-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Conversion Info */}
      {showConversion && convertedAmount !== null && (
        <div className="mt-2 p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-sm">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300">
            <span>
              {amount?.toFixed(2)} {getCurrencySymbol(selectedCurrency)}
            </span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
            <span className="font-medium">
              {convertedAmount.toFixed(2)} {getCurrencySymbol(targetCurrency)}
            </span>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Currency List */}
          <div className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
            {currencyList.map(([code, info]) => {
              const isSelected = code === selectedCurrency;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelect(code as CurrencyCode)}
                  className={`w-full flex items-center justify-between p-3 transition-colors ${
                    isSelected
                      ? 'bg-primary-light dark:bg-blue-900/50 text-primary dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {info.symbol}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                        {code}
                      </span>
                      <span className="text-xs text-text-secondary dark:text-gray-400">
                        {info.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary dark:text-blue-300">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default CurrencySelector;
