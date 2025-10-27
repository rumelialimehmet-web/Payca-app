import React from 'react';

export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  quickAmounts?: number[];
}

export function AmountInput({
  value,
  onChange,
  currency = '₺',
  quickAmounts = [50, 100, 250, 500]
}: AmountInputProps) {
  const handleQuickAmount = (amount: number) => {
    onChange(amount.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow numbers and decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <section className="bg-primary-light rounded-xl p-6 my-4 text-center">
      {/* Amount Input */}
      <div className="flex justify-center items-center">
        <span className="text-5xl font-bold text-text-primary mr-2">{currency}</span>
        <input
          className="w-full text-6xl font-bold text-text-primary bg-transparent border-none focus:ring-0 p-0 m-0 text-center placeholder:text-text-primary/30 focus:outline-none"
          inputMode="decimal"
          placeholder="0.00"
          type="text"
          value={value}
          onChange={handleInputChange}
          autoFocus
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex gap-2 justify-center mt-6">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleQuickAmount(amount)}
            className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white px-4 transition-transform hover:scale-105 active:scale-95"
          >
            <p className="text-primary text-sm font-medium leading-normal">
              {amount}{currency}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default AmountInput;
