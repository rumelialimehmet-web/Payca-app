import React from 'react';

export interface Category {
  id: string;
  emoji: string;
  name: string;
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', emoji: '🍕', name: 'Yemek' },
  { id: 'transportation', emoji: '🚗', name: 'Ulaşım' },
  { id: 'rent', emoji: '🏠', name: 'Kira' },
  { id: 'shopping', emoji: '🛒', name: 'Market' },
  { id: 'entertainment', emoji: '🎉', name: 'Eğlence' },
  { id: 'bills', emoji: '💡', name: 'Faturalar' },
  { id: 'health', emoji: '🏥', name: 'Sağlık' },
  { id: 'education', emoji: '📚', name: 'Eğitim' },
  { id: 'other', emoji: '➕', name: 'Diğer' }
];

export function CategorySelector({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onSelectCategory
}: CategorySelectorProps) {
  return (
    <div>
      <p className="text-text-secondary text-sm font-medium leading-normal mb-3 px-1">
        Kategori
      </p>
      <div
        className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 transition-all ${
              selectedCategory === category.id
                ? 'bg-primary-light border border-primary'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <p
              className={`text-sm font-medium leading-normal ${
                selectedCategory === category.id
                  ? 'text-primary'
                  : 'text-text-primary dark:text-gray-200'
              }`}
            >
              {category.emoji} {category.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;
