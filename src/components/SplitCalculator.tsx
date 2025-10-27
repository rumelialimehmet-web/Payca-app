import React, { useState } from 'react';

export interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export interface SplitCalculatorProps {
  members: Member[];
  selectedMembers: string[];
  onMembersChange: (memberIds: string[]) => void;
  splitType: 'equal' | 'percentage' | 'custom';
  onSplitTypeChange: (type: 'equal' | 'percentage' | 'custom') => void;
  customSplits?: Record<string, number>;
  onCustomSplitsChange?: (splits: Record<string, number>) => void;
}

export function SplitCalculator({
  members,
  selectedMembers,
  onMembersChange,
  splitType,
  onSplitTypeChange,
  customSplits = {},
  onCustomSplitsChange
}: SplitCalculatorProps) {
  const allSelected = selectedMembers.length === members.length;

  const handleToggleAll = () => {
    if (allSelected) {
      onMembersChange([]);
    } else {
      onMembersChange(members.map(m => m.id));
    }
  };

  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      onMembersChange(selectedMembers.filter(id => id !== memberId));
    } else {
      onMembersChange([...selectedMembers, memberId]);
    }
  };

  return (
    <div className="border border-border-color rounded-lg p-4 space-y-4">
      {/* Header with Toggle All */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-text-primary dark:text-gray-200">
          Kimler arasında bölünecek?
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Tümü</span>
          <button
            type="button"
            onClick={handleToggleAll}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              allSelected ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            role="switch"
            aria-checked={allSelected}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                allSelected ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Member Avatars */}
      <div className="flex justify-center -space-x-2">
        {members.slice(0, 5).map((member) => {
          const isSelected = selectedMembers.includes(member.id);
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => handleToggleMember(member.id)}
              className={`inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 transition-all hover:scale-110 ${
                isSelected ? 'opacity-100' : 'opacity-40 grayscale'
              }`}
              title={member.name}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          );
        })}
        {members.length > 5 && (
          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
              +{members.length - 5}
            </span>
          </div>
        )}
      </div>

      {/* Split Type Tabs */}
      <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center">
        <button
          type="button"
          onClick={() => onSplitTypeChange('equal')}
          className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${
            splitType === 'equal'
              ? 'text-text-primary bg-white dark:bg-gray-700 shadow-sm'
              : 'text-text-secondary'
          }`}
        >
          Eşit
        </button>
        <button
          type="button"
          onClick={() => onSplitTypeChange('percentage')}
          className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${
            splitType === 'percentage'
              ? 'text-text-primary bg-white dark:bg-gray-700 shadow-sm'
              : 'text-text-secondary'
          }`}
        >
          Yüzde
        </button>
        <button
          type="button"
          onClick={() => onSplitTypeChange('custom')}
          className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${
            splitType === 'custom'
              ? 'text-text-primary bg-white dark:bg-gray-700 shadow-sm'
              : 'text-text-secondary'
          }`}
        >
          Özel
        </button>
      </div>

      {/* Custom Split Inputs (if custom type is selected) */}
      {splitType === 'custom' && onCustomSplitsChange && (
        <div className="space-y-2 mt-3">
          {selectedMembers.map((memberId) => {
            const member = members.find(m => m.id === memberId);
            if (!member) return null;

            return (
              <div key={memberId} className="flex items-center justify-between gap-3">
                <span className="text-sm text-text-primary dark:text-gray-200 flex-1">
                  {member.name}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={customSplits[memberId] || ''}
                  onChange={(e) => {
                    onCustomSplitsChange({
                      ...customSplits,
                      [memberId]: parseFloat(e.target.value) || 0
                    });
                  }}
                  className="w-24 px-3 py-1 text-sm border border-border-color rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SplitCalculator;
