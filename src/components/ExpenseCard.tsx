import React from 'react';
import { getCurrencySymbol, CurrencyCode } from '../lib/currency-exchange';

export interface ExpenseCardProps {
  id: string;
  emoji?: string;
  title: string;
  amount: number;
  currency?: CurrencyCode;
  paidBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  userShare: number;
  isUserOwed: boolean; // true = user paid and is owed, false = user owes
  category?: string;
  date?: string;
  receiptUrl?: string | null;
  onClick?: () => void;
}

export function ExpenseCard({
  id,
  emoji = '🛒',
  title,
  amount,
  currency = 'TRY',
  paidBy,
  userShare,
  isUserOwed,
  category,
  date,
  receiptUrl,
  onClick
}: ExpenseCardProps) {
  const currencySymbol = getCurrencySymbol(currency);
  const getCategoryEmoji = (cat?: string) => {
    const map: Record<string, string> = {
      food: '🍔',
      transportation: '🚗',
      bills: '💡',
      rent: '🏠',
      entertainment: '🎬',
      shopping: '🛍️',
      health: '🏥',
      education: '📚',
      other: '📦'
    };
    return map[cat || 'other'] || emoji;
  };

  const categoryEmoji = getCategoryEmoji(category);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-sm cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Category Emoji */}
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-2xl">
        {categoryEmoji}
      </div>

      {/* Expense Info */}
      <div className="flex-1">
        <p className="font-bold text-slate-800 dark:text-slate-100">{title}</p>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{paidBy.name} ödedi</span>
          {paidBy.avatar && (
            <img
              alt={paidBy.name}
              className="size-5 rounded-full"
              src={paidBy.avatar}
            />
          )}
          {receiptUrl && (
            <span className="material-symbols-outlined text-base text-blue-500" title="Fiş mevcut">
              receipt
            </span>
          )}
        </div>
      </div>

      {/* Amount & User Share */}
      <div className="text-right">
        <p className="font-bold text-slate-800 dark:text-slate-100">
          {currencySymbol}{amount.toFixed(2)}
        </p>
        <p
          className={`rounded-md px-2 py-0.5 text-xs font-medium ${
            isUserOwed
              ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
          }`}
        >
          {isUserOwed ? 'Alacak:' : 'Borç:'} {currencySymbol}{Math.abs(userShare).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default ExpenseCard;
