import React, { useState } from 'react';

interface HelpFeedbackModalProps {
  onClose: () => void;
}

export function HelpFeedbackModal({ onClose }: HelpFeedbackModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [bugReport, setBugReport] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      // Handle feedback submission
      console.log('Feedback submitted:', feedback);
      alert('Geri bildiriminiz için teşekkürler!');
      setFeedback('');
    }
  };

  const handleBugReportSubmit = () => {
    if (bugReport.trim()) {
      // Handle bug report submission
      console.log('Bug report submitted:', bugReport, screenshot);
      alert('Hata raporunuz için teşekkürler!');
      setBugReport('');
      setScreenshot(null);
    }
  };

  const handleScreenshotUpload = () => {
    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setScreenshot(file);
        alert('Ekran görüntüsü eklendi!');
      }
    };
    input.click();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[3000]"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed bottom-0 left-0 right-0 z-[3001] flex flex-col">
        <div className="flex max-h-[90vh] flex-col overflow-y-auto bg-white dark:bg-gray-900 rounded-t-lg shadow-2xl">
          {/* Bottom Sheet Handle */}
          <div className="flex h-5 w-full items-center justify-center pt-3 flex-shrink-0">
            <div className="h-1 w-10 rounded-full bg-[#D1D5DB] dark:bg-gray-700"></div>
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-4 flex-shrink-0">
            <h3 className="flex-1 text-[#111827] dark:text-white text-2xl font-bold leading-tight text-center">
              Destek Merkezi
            </h3>
            <button
              onClick={onClose}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white"
            >
              <span className="material-symbols-outlined !text-3xl">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
            {/* Search Bar */}
            <div className="py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#6B7280] dark:text-gray-400 flex border border-[#D1D5DB] dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#111827] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#D1D5DB] dark:border-gray-700 bg-white dark:bg-gray-800 h-full placeholder:text-[#6B7280] dark:placeholder:text-gray-400 px-4 border-l-0 text-base font-normal leading-normal"
                    placeholder="Sıkça sorulan sorularda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Feedback Section */}
            <div className="pt-5">
              <h3 className="text-[#111827] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
                Geri Bildirim Gönder
              </h3>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col min-w-40 flex-1">
                  <textarea
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111827] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#D1D5DB] dark:border-gray-700 bg-white dark:bg-gray-800 min-h-28 placeholder:text-[#6B7280] dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                    placeholder="Geri bildiriminiz bizim için değerli..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </label>
                <button
                  onClick={handleFeedbackSubmit}
                  className="flex items-center justify-center w-full h-12 px-6 text-base font-bold text-white rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] transition-opacity active:scale-95"
                >
                  Gönder
                </button>
              </div>
            </div>

            {/* Bug Report Section */}
            <div className="pt-6">
              <h3 className="text-[#111827] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
                Hata Bildir
              </h3>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col min-w-40 flex-1">
                  <textarea
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111827] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#D1D5DB] dark:border-gray-700 bg-white dark:bg-gray-800 min-h-28 placeholder:text-[#6B7280] dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                    placeholder="Karşılaştığınız hatayı detaylıca anlatın..."
                    value={bugReport}
                    onChange={(e) => setBugReport(e.target.value)}
                  />
                </label>
                <button
                  onClick={handleScreenshotUpload}
                  className="flex items-center justify-center gap-3 w-full h-12 px-6 text-base font-bold text-[#6B7280] dark:text-gray-400 rounded-lg border-2 border-dashed border-[#D1D5DB] dark:border-gray-700 bg-[#f6f6f8] dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  {screenshot ? `${screenshot.name} eklendi` : 'Ekran Görüntüsü Ekle'}
                </button>
                <button
                  onClick={handleBugReportSubmit}
                  className="flex items-center justify-center w-full h-12 px-6 text-base font-bold text-white rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] transition-opacity active:scale-95"
                >
                  Raporu Gönder
                </button>
              </div>
            </div>

            {/* Direct Links Section */}
            <div className="pt-6">
              <div className="flex flex-col border-t border-[#D1D5DB] dark:border-gray-700">
                <a
                  className="flex items-center gap-4 py-4 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg px-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Open live support');
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <span className="flex-1 text-base font-medium text-[#111827] dark:text-white">
                    Canlı Destek
                  </span>
                  <span className="material-symbols-outlined text-[#6B7280] dark:text-gray-400 group-hover:text-[#111827] dark:group-hover:text-white">
                    chevron_right
                  </span>
                </a>

                <a
                  className="flex items-center gap-4 py-4 border-t border-[#D1D5DB] dark:border-gray-700 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg px-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('View all FAQs');
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">help_center</span>
                  </div>
                  <span className="flex-1 text-base font-medium text-[#111827] dark:text-white">
                    Tüm SSS'leri Görüntüle
                  </span>
                  <span className="material-symbols-outlined text-[#6B7280] dark:text-gray-400 group-hover:text-[#111827] dark:group-hover:text-white">
                    chevron_right
                  </span>
                </a>

                <a
                  className="flex items-center gap-4 py-4 border-t border-[#D1D5DB] dark:border-gray-700 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg px-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Rate app');
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <span className="flex-1 text-base font-medium text-[#111827] dark:text-white">
                    Uygulamayı Değerlendir
                  </span>
                  <span className="material-symbols-outlined text-[#6B7280] dark:text-gray-400 group-hover:text-[#111827] dark:group-hover:text-white">
                    chevron_right
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HelpFeedbackModal;
