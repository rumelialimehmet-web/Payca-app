import React, { useState } from 'react';
import {
  exportGroupReport,
  GroupForPDF,
  BalanceForPDF,
  SettlementForPDF,
} from '../lib/pdf-export';
import { exportGroupToExcel } from '../lib/excel-export';

export interface ExportButtonProps {
  group: any; // Group data from the app
  balances?: any[]; // Balance data
  settlements?: any[]; // Settlement data
  variant?: 'icon' | 'button' | 'menu-item';
  className?: string;
}

export function ExportButton({
  group,
  balances = [],
  settlements = [],
  variant = 'button',
  className = '',
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const handleExportPDF = async () => {
    setExporting('pdf');
    setIsOpen(false);

    try {
      // Transform data to PDF format
      const groupForPDF: GroupForPDF = {
        id: group.id,
        name: group.name,
        description: group.description,
        members: group.members.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
        })),
        expenses: group.expenses?.map((e: any) => ({
          id: e.id,
          description: e.description,
          amount: e.amount,
          currency: e.currency || 'TRY',
          category: e.category,
          date: e.date,
          paidBy: {
            id: e.paidBy,
            name: group.members.find((m: any) => m.id === e.paidBy)?.name || 'Unknown',
          },
          splits: e.splits?.map((s: any) => ({
            userId: s.userId,
            userName: group.members.find((m: any) => m.id === s.userId)?.name || 'Unknown',
            amount: s.amount,
          })),
          receiptUrl: e.receiptUrl,
        })) || [],
        currency: group.currency || 'TRY',
      };

      const balancesForPDF: BalanceForPDF[] = balances.map((b: any) => ({
        userId: b.userId,
        userName: b.userName,
        balance: b.balance,
        currency: b.currency || 'TRY',
      }));

      const settlementsForPDF: SettlementForPDF[] = settlements.map((s: any) => ({
        from: s.from,
        to: s.to,
        amount: s.amount,
        currency: s.currency || 'TRY',
      }));

      await exportGroupReport(groupForPDF, balancesForPDF, settlementsForPDF);

      // Show success message
      alert('PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF oluşturulurken bir hata oluştu: ' + (error as Error).message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting('excel');
    setIsOpen(false);

    try {
      // Use existing Excel export function
      exportGroupToExcel(group);

      // Show success message
      alert('Excel dosyası başarıyla indirildi!');
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Excel dosyası oluşturulurken bir hata oluştu: ' + (error as Error).message);
    } finally {
      setExporting(null);
    }
  };

  // Icon variant - simple icon button
  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
          disabled={exporting !== null}
        >
          <span className="material-symbols-outlined text-text-primary dark:text-gray-200">
            download
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border-color dark:border-gray-700 z-20">
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
              >
                <span className="material-symbols-outlined text-red-500">
                  picture_as_pdf
                </span>
                <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                  PDF İndir
                </span>
              </button>
              <button
                onClick={handleExportExcel}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
              >
                <span className="material-symbols-outlined text-green-600">
                  table_chart
                </span>
                <span className="text-sm font-medium text-text-primary dark:text-gray-200">
                  Excel İndir
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Menu item variant - for use in dropdown menus
  if (variant === 'menu-item') {
    return (
      <>
        <button
          onClick={handleExportPDF}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
          disabled={exporting !== null}
        >
          <span className="material-symbols-outlined text-red-500">
            picture_as_pdf
          </span>
          <span className="text-sm font-medium text-text-primary dark:text-gray-200">
            PDF Raporu İndir
          </span>
        </button>
        <button
          onClick={handleExportExcel}
          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
          disabled={exporting !== null}
        >
          <span className="material-symbols-outlined text-green-600">
            table_chart
          </span>
          <span className="text-sm font-medium text-text-primary dark:text-gray-200">
            Excel Raporu İndir
          </span>
        </button>
      </>
    );
  }

  // Button variant - full button with text
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors ${className}`}
        disabled={exporting !== null}
      >
        {exporting ? (
          <>
            <span className="material-symbols-outlined animate-spin">
              refresh
            </span>
            <span className="font-medium">
              {exporting === 'pdf' ? 'PDF' : 'Excel'} Hazırlanıyor...
            </span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">download</span>
            <span className="font-medium">Rapor İndir</span>
          </>
        )}
      </button>

      {isOpen && !exporting && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border-color dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-border-color dark:border-gray-600">
              <p className="text-xs font-medium text-text-secondary dark:text-gray-400">
                Rapor Formatı Seçin
              </p>
            </div>

            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-red-500 text-2xl">
                picture_as_pdf
              </span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-text-primary dark:text-gray-200">
                  PDF Raporu
                </p>
                <p className="text-xs text-text-secondary dark:text-gray-400">
                  Grafikli, detaylı rapor
                </p>
              </div>
            </button>

            <button
              onClick={handleExportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-green-600 text-2xl">
                table_chart
              </span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-text-primary dark:text-gray-200">
                  Excel Tablosu
                </p>
                <p className="text-xs text-text-secondary dark:text-gray-400">
                  Düzenlenebilir veri
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportButton;
