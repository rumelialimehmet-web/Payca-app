import React from 'react';

interface OnboardingModalProps {
  onClose: () => void;
  onExplore: () => void;
}

export function OnboardingModal({ onClose, onExplore }: OnboardingModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[3000]"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed bottom-0 left-0 right-0 z-[3001] flex flex-col items-stretch">
        <div
          className="flex flex-col items-stretch bg-white dark:bg-background-dark rounded-t-3xl max-h-[90vh] overflow-y-auto"
          style={{
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -10px 30px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Drag Handle */}
          <button className="flex h-5 w-full items-center justify-center pt-3">
            <div className="h-1 w-9 rounded-full bg-[#dcdce5] dark:bg-gray-700"></div>
          </button>

          {/* Header */}
          <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between">
            <div className="flex w-12 shrink-0 items-center"></div>
            <h2 className="text-[#111827] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
              Gelişmiş Harcama Takibi
            </h2>
            <div className="flex w-12 items-center justify-end">
              <button
                onClick={onClose}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-[#6B7280] dark:text-gray-400 gap-2 text-base font-bold leading-normal min-w-0 p-0"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex w-full bg-white dark:bg-background-dark py-3 px-6">
            <div className="w-full overflow-hidden bg-white dark:bg-background-dark aspect-[4/3] flex">
              <div
                className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJtAVlpac07kHk3gXm3Wr1T-1e_QuHUafs0JcBLJbPUQkibFWICKgxE7vrYUPhvZXsZSGHUP_kTW5NPYZTPkWJezqcAMVfdu2iNWU6_U6oc4bIMTFaWmiDfYTf9P0F9wpLQflhU3jvzsKkYva3XjyP5wvo0gD5TyHxM-WHz8K6va65JqudyAdRHaoE4DBtZlwsdgyNoRyY7mnOHL6aRCnBqn_VFhAfRP7d1eFHF6VYW8Ai5kZVukuwxHkJXZQx6Dn1y3wZ7AG7I2p1")'
                }}
                role="img"
                aria-label="3D illustration of charts and graphs representing financial tracking"
              />
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-[#111827] dark:text-white tracking-light text-2xl font-bold leading-tight px-6 text-center pb-2 pt-5">
            Track Your Spending Like a Pro
          </h3>
          <p className="text-[#6B7280] dark:text-gray-400 text-base font-normal leading-normal pb-3 pt-1 px-6 text-center">
            Get a clearer view of your finances with automated categorization, insightful reports, and custom budgets.
          </p>

          {/* Feature Cards */}
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div>
                <p className="font-semibold text-[#111827] dark:text-white">Automated Categorization</p>
                <p className="text-sm text-[#6B7280] dark:text-gray-400">Spend less time organizing.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">bar_chart</span>
              </div>
              <div>
                <p className="font-semibold text-[#111827] dark:text-white">Insightful Reports</p>
                <p className="text-sm text-[#6B7280] dark:text-gray-400">Understand where your money goes.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                <p className="font-semibold text-[#111827] dark:text-white">Custom Budgets</p>
                <p className="text-sm text-[#6B7280] dark:text-gray-400">Stay on track with your goals.</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 p-6 pt-6">
            <button
              onClick={onExplore}
              className="w-full h-14 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white font-bold text-base shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_0_rgba(79,70,229,0.23)] transition-all duration-300 active:scale-95"
            >
              Hemen Keşfet!
            </button>
            <button
              onClick={onClose}
              className="w-full h-14 rounded-full bg-transparent text-[#6B7280] dark:text-gray-400 font-medium text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnboardingModal;
