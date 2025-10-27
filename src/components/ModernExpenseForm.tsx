import React, { useState } from 'react';
import { AmountInput } from './AmountInput';
import { CategorySelector, DEFAULT_CATEGORIES, Category } from './CategorySelector';
import { SplitCalculator, Member } from './SplitCalculator';

export interface ModernExpenseFormProps {
  groupId?: string;
  members: Member[];
  currentUser: { id: string; name: string; avatar?: string };
  onSave: (expense: ExpenseData) => void;
  onCancel: () => void;
}

export interface ExpenseData {
  amount: number;
  description: string;
  category: string;
  date: Date;
  paidBy: string;
  splitType: 'equal' | 'percentage' | 'custom';
  selectedMembers: string[];
  customSplits?: Record<string, number>;
  note?: string;
  photo?: string;
}

export function ModernExpenseForm({
  groupId,
  members,
  currentUser,
  onSave,
  onCancel
}: ModernExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('food');
  const [date, setDate] = useState(new Date());
  const [paidBy, setPaidBy] = useState(currentUser.id);
  const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'custom'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map(m => m.id));
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [photo, setPhoto] = useState<string>();

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Bugün, ${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Dün, ${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`;
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  const getPaidByName = () => {
    if (paidBy === currentUser.id) return 'Sen';
    const member = members.find(m => m.id === paidBy);
    return member?.name || 'Bilinmeyen';
  };

  const getPaidByAvatar = () => {
    if (paidBy === currentUser.id) return currentUser.avatar;
    const member = members.find(m => m.id === paidBy);
    return member?.avatar;
  };

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Lütfen geçerli bir tutar girin');
      return;
    }

    if (!description.trim()) {
      alert('Lütfen bir açıklama girin');
      return;
    }

    if (selectedMembers.length === 0) {
      alert('Lütfen en az bir kişi seçin');
      return;
    }

    const expenseData: ExpenseData = {
      amount: parseFloat(amount),
      description: description.trim(),
      category: selectedCategory,
      date,
      paidBy,
      splitType,
      selectedMembers,
      customSplits: splitType === 'custom' ? customSplits : undefined,
      note: note.trim() || undefined,
      photo
    };

    onSave(expenseData);
  };

  return (
    <div className="relative w-full h-screen bg-white dark:bg-background-dark font-display overflow-hidden flex flex-col">
      {/* Top App Bar */}
      <header className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-color dark:border-gray-700">
        <button
          onClick={onCancel}
          className="text-text-primary dark:text-gray-200 flex size-10 shrink-0 items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-text-primary dark:text-gray-200 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Yeni Harcama
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4">
        {/* Amount Section */}
        <AmountInput value={amount} onChange={setAmount} />

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Description Input */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800">
            <span className="text-2xl">📝</span>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary dark:text-gray-200 focus:outline-0 focus:ring-0 border-none bg-white dark:bg-gray-800 p-0 text-base font-normal leading-normal placeholder:text-text-secondary dark:placeholder:text-gray-500"
              placeholder="Ne için harcandı?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category Selector */}
          <CategorySelector
            categories={DEFAULT_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Date & Payer */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Selector */}
            <button
              onClick={() => {
                // In real implementation, open date picker
                const newDate = prompt('Enter date (YYYY-MM-DD):');
                if (newDate) {
                  setDate(new Date(newDate));
                }
              }}
              className="flex items-center gap-3 text-left w-full p-3 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <span className="material-symbols-outlined text-text-secondary dark:text-gray-400">
                calendar_month
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary dark:text-gray-400">Tarih</span>
                <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                  {formatDate(date)}
                </span>
              </div>
            </button>

            {/* Payer Selector */}
            <button
              onClick={() => {
                // In real implementation, open member selector
                // For now, just toggle between current user and first member
                if (paidBy === currentUser.id && members.length > 0) {
                  setPaidBy(members[0].id);
                } else {
                  setPaidBy(currentUser.id);
                }
              }}
              className="flex items-center gap-3 text-left w-full p-3 rounded-lg border border-border-color dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              {getPaidByAvatar() ? (
                <img
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                  src={getPaidByAvatar()}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  {getPaidByName().charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary dark:text-gray-400">Ödeyen</span>
                <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                  {getPaidByName()}
                </span>
              </div>
            </button>
          </div>

          {/* Split Calculator */}
          <SplitCalculator
            members={members}
            selectedMembers={selectedMembers}
            onMembersChange={setSelectedMembers}
            splitType={splitType}
            onSplitTypeChange={setSplitType}
            customSplits={customSplits}
            onCustomSplitsChange={setCustomSplits}
          />

          {/* Optional Fields */}
          <div className="space-y-2">
            {showNoteInput ? (
              <div className="border border-border-color dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                <textarea
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-text-primary dark:text-gray-200 placeholder:text-text-secondary dark:placeholder:text-gray-500 resize-none"
                  placeholder="Notunuzu buraya yazın..."
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowNoteInput(true)}
                className="flex items-center gap-2 text-primary font-medium w-full text-left p-2 rounded-md hover:bg-primary-light dark:hover:bg-gray-800"
              >
                <span className="material-symbols-outlined">edit_note</span>
                Not Ekle
              </button>
            )}

            <button className="flex items-center gap-2 text-primary font-medium w-full text-left p-2 rounded-md hover:bg-primary-light dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">photo_camera</span>
              Fiş/Fotoğraf Ekle
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white dark:bg-background-dark p-4 pt-3 border-t border-border-color dark:border-gray-700">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSave}
            className="w-full h-14 rounded-xl bg-primary text-white text-base font-semibold shadow-lg shadow-primary/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            Harcamayı Kaydet
          </button>
          <button
            onClick={onCancel}
            className="text-text-secondary dark:text-gray-400 font-medium"
          >
            İptal
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ModernExpenseForm;
