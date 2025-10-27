import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sticky?: boolean;
}

export function Tabs({ tabs, activeTab, onTabChange, sticky = false }: TabsProps) {
  return (
    <div className={`${sticky ? 'sticky top-0 z-20' : ''} bg-background-light dark:bg-background-dark`}>
      <div className="flex border-b border-slate-200 dark:border-slate-700 px-4 justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-1 flex-col items-center justify-center border-b-[3px] ${
              activeTab === tab.id
                ? 'border-b-indigo-600 text-indigo-600'
                : 'border-b-transparent text-slate-500 dark:text-slate-400'
            } pb-[13px] pt-4 transition-colors`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              {tab.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
