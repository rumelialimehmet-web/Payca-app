import React from 'react';

export interface BalanceCardProps {
  youOwe: number;
  owedToYou: number;
  groupCount: number;
  currency?: string;
}

export function BalanceCard({ youOwe, owedToYou, groupCount, currency = '₺' }: BalanceCardProps) {
  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  return (
    <div className="bg-white dark:bg-background-dark dark:border dark:border-gray-700 rounded-xl p-5 shadow-card">
      <div className="flex justify-around items-center text-center">
        {/* You Are Owed */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Alacaklısın</p>
          <p className="text-green-500 text-2xl font-bold mt-1">
            +{formatAmount(owedToYou)}{currency}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 mx-2"></div>

        {/* You Owe */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Borçlusun</p>
          <p className="text-red-500 text-2xl font-bold mt-1">
            -{formatAmount(youOwe)}{currency}
          </p>
        </div>
      </div>

      {/* Group Count */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
        {groupCount} grup
      </p>
    </div>
  );
}

export default BalanceCard;
