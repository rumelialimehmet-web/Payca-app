import React from 'react';

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface GroupCardProps {
  id: string;
  name: string;
  emoji?: string;
  totalAmount: number;
  currency?: string;
  members: GroupMember[];
  balance: number; // positive = you are owed, negative = you owe
  location?: string;
  date?: string;
  lastUpdate?: string;
  onClick?: () => void;
}

export function GroupCard({
  id,
  name,
  emoji = '💰',
  totalAmount,
  currency = '₺',
  members,
  balance,
  location,
  date,
  lastUpdate = 'Son güncelleme bilinmiyor',
  onClick
}: GroupCardProps) {
  const formatAmount = (amount: number) => {
    return Math.abs(amount).toFixed(0);
  };

  const getBalanceBadge = () => {
    if (balance === 0) {
      return (
        <div className="flex items-center justify-center rounded-full h-7 px-3 bg-gray-100 dark:bg-gray-700">
          <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">Ödeşildi</span>
        </div>
      );
    } else if (balance > 0) {
      return (
        <div className="flex items-center justify-center rounded-full h-7 px-3 bg-green-100 dark:bg-green-500/20">
          <span className="text-green-600 dark:text-green-400 text-xs font-medium">
            Alacaklısın: {formatAmount(balance)}{currency}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center rounded-full h-7 px-3 bg-red-100 dark:bg-red-500/20">
          <span className="text-red-600 dark:text-red-400 text-xs font-medium">
            Borçlusun: {formatAmount(balance)}{currency}
          </span>
        </div>
      );
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-4 rounded-lg bg-white dark:bg-background-dark dark:border dark:border-gray-700 p-5 shadow-card cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Header: Name + Members */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[#111827] dark:text-gray-100 text-base font-semibold">
            {emoji} {name}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Toplam: {totalAmount.toFixed(0)}{currency}
          </p>
        </div>

        {/* Member Avatars */}
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((member, index) => (
            <div
              key={member.id}
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-background-dark overflow-hidden bg-gray-200 dark:bg-gray-700"
              title={member.name}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
          {members.length > 3 && (
            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-background-dark bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                +{members.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Balance Badge + Last Update */}
      <div className="flex items-center justify-between">
        {getBalanceBadge()}
        <p className="text-gray-400 dark:text-gray-500 text-xs">{lastUpdate}</p>
      </div>

      {/* Footer: Location + Date */}
      {(location || date) && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{location || '—'}</span>
          <span>{date || '—'}</span>
        </div>
      )}
    </div>
  );
}

export default GroupCard;
