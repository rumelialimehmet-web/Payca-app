import React, { useState } from 'react';
import { ArrowLeft, Calendar, Edit, Camera } from 'lucide-react';

interface Category {
  id: string;
  emoji: string;
  label: string;
}

export default function StitchExpenseForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedDate, setSelectedDate] = useState('Bugün, 15 Ocak');
  const [splitType, setSplitType] = useState('equal');
  const [splitAll, setSplitAll] = useState(true);

  const categories: Category[] = [
    { id: 'food', emoji: '🍕', label: 'Yemek' },
    { id: 'transport', emoji: '🚗', label: 'Ulaşım' },
    { id: 'rent', emoji: '🏠', label: 'Kira' },
    { id: 'shopping', emoji: '🛒', label: 'Market' },
    { id: 'entertainment', emoji: '🎉', label: 'Eğlence' },
    { id: 'other', emoji: '➕', label: 'Diğer' },
  ];

  const quickAmounts = [50, 100, 250, 500];

  const members = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUiwlfz1Nb1LgKp03SBlYgBMGTUBob2c-N-tlCd66X1D2zGEFmiadeW6wTklJG84vbTyNO3qHmDGnrnNKaZT2RfGAHuBYokaAoGirSO1fZ42fGAgT25KSY8V9sz7sT5Q0HO2fCshgynz0T4NDR6CCEL-M_m6inEhi1g6uavCw2hAlv5iDbhcQ7YFmsViXZqUOu-r0oCNe915nt2k3GjRnUmhQo2VZlV4vzegmSvabsOXSfhVId1803HDrZi-CqBdX744fx542M7IDZ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBA1uovAg4B81kwH3Cn382UKg5mmPIBZYc9nts96Fvt8MmxuKsK8ygn1qu_ApLUaiFNvEpfSBpop6IhUZWChIfTg7Nc0wxPZiZ9hIMnMFlZCWoaZ5bE0ttZC9RU-INsuXq7rxhgVnT-j2qjamVqxrihjzqoI8H1r3lUgSHBM6uR8a7J5VwzkrEduNd2mTc05BYeHKlK7H2YPfufGu-BvovPa0wdoXjOm_aFBapa7pTehow61JBGUYtgj_wuI3bmHc3kgRUR4BGHIQWy',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDKFqXNI-IE9O8m6zJnFsVEjg-6r4HxldWYI7Ka3eWUO-40i2aT4NO2vRZEPjPa9NOKx_HG7fDAoIAbezxYq0SG-ybrFlqsKvbGvexCKJHMmdiF-keVETijZwjGH_1Dhj-2KY3vyBSg-jdYiBWUrBtoGcbY8nCyQbxfM6coTy0Q6O7FZMIoGDyErwQpDWCkvlOD3ArZ0qPXqk6esnXd3uLsVN8Ix5BwqUVI8sYUXo_O0weyK91rP4Q5vtX_TLbadmTPQClP_ALVNG-2',
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSave = () => {
    console.log({
      amount,
      description,
      category: selectedCategory,
      date: selectedDate,
      splitType,
      splitAll,
    });
    // API call here
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen bg-white font-display overflow-hidden flex flex-col">
      {/* Top App Bar */}
      <header className="flex items-center bg-white p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200">
        <button className="text-gray-900 flex size-10 shrink-0 items-center justify-center hover:bg-gray-50 rounded-lg transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-gray-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          Yeni Harcama
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4">
        {/* Amount Section */}
        <section className="bg-indigo-50 rounded-xl p-6 my-4 text-center">
          <div className="flex justify-center items-center mb-6">
            <span className="text-5xl font-bold text-gray-900 mr-2">₺</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-6xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 m-0 text-center placeholder:text-gray-300 max-w-xs"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white px-4 hover:bg-gray-50 transition"
              >
                <p className="text-indigo-600 text-sm font-medium leading-normal">
                  {value}₺
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Title Input */}
          <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
            <span className="text-2xl">📝</span>
            <input
              type="text"
              placeholder="Ne için harcandı?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 focus:outline-0 focus:ring-0 border-none bg-white p-0 text-base font-normal leading-normal placeholder:text-gray-400"
            />
          </div>

          {/* Category Selector */}
          <div>
            <p className="text-gray-500 text-sm font-medium leading-normal mb-3 px-1">
              Kategori
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 border transition ${
                    selectedCategory === category.id
                      ? 'bg-indigo-50 border-indigo-600'
                      : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium leading-normal ${
                      selectedCategory === category.id
                        ? 'text-indigo-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {category.emoji} {category.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Payer */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-3 text-left w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Tarih</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {selectedDate}
                </span>
              </div>
            </button>

            <button className="flex items-center gap-3 text-left w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
              <img
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX7IUF8ex4NzNUH1MYPrN_Ckaoul_UOyQ0Ds0J3GZXEPNp9sqWZZGtu0Bok_lZeelqjtLKRY5L5oNXlglNP6_I37U6eD61blJFnF0XebFJf8VcJa8UvnVzQD9ANCMRAWlPwptapb39CtR_-vahE1oUCdAf9IpV_jUjJZWw2B1w_ByePTpf-RxNHJFMUc0A-D-2m4o40D5ylngAWKKarde7Wr2w2rpVtK2gOgQ4VtnWp-EZF7vKxhUFq9gS1YmxglZdo9XcHqAlkatK"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Ödeyen</span>
                <span className="text-sm font-medium text-gray-900">Sen</span>
              </div>
            </button>
          </div>

          {/* Split Options */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">Kimler arasında bölünecek?</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Tümü</span>
                <button
                  onClick={() => setSplitAll(!splitAll)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    splitAll
                      ? 'bg-indigo-600 focus:ring-indigo-600'
                      : 'bg-gray-200 focus:ring-gray-400'
                  }`}
                  role="switch"
                  aria-checked={splitAll}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      splitAll ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Member Avatars */}
            <div className="flex justify-center -space-x-2">
              {members.map((avatar, idx) => (
                <img
                  key={idx}
                  alt={`User ${idx + 1}`}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src={avatar}
                />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-500">
                +2
              </div>
            </div>

            {/* Split Type Selector */}
            <div className="bg-gray-100 p-1 rounded-lg flex items-center">
              {[
                { id: 'equal', label: 'Eşit' },
                { id: 'percentage', label: 'Yüzde' },
                { id: 'custom', label: 'Özel' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSplitType(type.id)}
                  className={`w-1/3 py-2 text-sm font-${
                    splitType === type.id ? 'semibold' : 'medium'
                  } rounded-md transition ${
                    splitType === type.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2">
            <button className="flex items-center gap-2 text-indigo-600 font-medium w-full text-left p-2 rounded-md hover:bg-indigo-50 transition">
              <Edit className="w-5 h-5" />
              Not Ekle
            </button>
            <button className="flex items-center gap-2 text-indigo-600 font-medium w-full text-left p-2 rounded-md hover:bg-indigo-50 transition">
              <Camera className="w-5 h-5" />
              Fiş/Fotoğraf Ekle
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white p-4 pt-3 border-t border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSave}
            className="w-full h-14 rounded-xl bg-indigo-600 text-white text-base font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 transition active:scale-95"
          >
            Harcamayı Kaydet
          </button>
          <button className="text-gray-500 font-medium hover:text-gray-700 transition">
            İptal
          </button>
        </div>
      </footer>
    </div>
  );
}
