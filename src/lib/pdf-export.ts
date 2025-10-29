/**
 * PDF Export Service
 * Generate professional PDF reports with charts and graphics
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrencyAmount, CurrencyCode, convertCurrency } from './currency-exchange';

// PDF Color Palette
const COLORS = {
  primary: '#3B82F6', // Blue
  success: '#10B981', // Green
  danger: '#EF4444', // Red
  warning: '#F59E0B', // Orange
  dark: '#1F2937',
  light: '#F3F4F6',
  white: '#FFFFFF',
};

export interface ExpenseForPDF {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  date: string;
  paidBy: {
    id: string;
    name: string;
  };
  splits?: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
  receiptUrl?: string | null;
}

export interface GroupForPDF {
  id: string;
  name: string;
  description?: string;
  members: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  expenses: ExpenseForPDF[];
  currency?: CurrencyCode;
}

export interface BalanceForPDF {
  userId: string;
  userName: string;
  balance: number;
  currency: CurrencyCode;
}

export interface SettlementForPDF {
  from: string;
  to: string;
  amount: number;
  currency: CurrencyCode;
}

/**
 * Generate comprehensive PDF report for a group
 */
export async function generateGroupPDF(
  group: GroupForPDF,
  balances: BalanceForPDF[],
  settlements: SettlementForPDF[]
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPos = 20;

  // === HEADER ===
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(COLORS.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Payça', 14, 20);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Grup Raporu', 14, 32);

  // Date
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(today, pageWidth - 14, 20, { align: 'right' });

  yPos = 50;

  // === GROUP INFO ===
  doc.setTextColor(COLORS.dark);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(group.name, 14, yPos);
  yPos += 10;

  if (group.description) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(group.description, 14, yPos);
    yPos += 8;
  }

  doc.setFontSize(10);
  doc.setTextColor(COLORS.dark);
  doc.text(`Üye Sayısı: ${group.members.length}`, 14, yPos);
  yPos += 6;
  doc.text(`Toplam Harcama: ${group.expenses.length}`, 14, yPos);
  yPos += 12;

  // === MEMBERS LIST ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Grup Üyeleri', 14, yPos);
  yPos += 8;

  const membersData = group.members.map((member, index) => [
    index + 1,
    member.name,
    member.email || '-',
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'İsim', 'Email']],
    body: membersData,
    theme: 'striped',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontSize: 10,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  // === EXPENSES TABLE ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Harcamalar', 14, yPos);
  yPos += 8;

  const expensesData = group.expenses.map((expense) => {
    const date = new Date(expense.date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return [
      date,
      expense.description,
      expense.category,
      expense.paidBy.name,
      formatCurrencyAmount(expense.amount, expense.currency),
      expense.receiptUrl ? '✓' : '-',
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Tarih', 'Açıklama', 'Kategori', 'Ödeyen', 'Tutar', 'Fiş']],
    body: expensesData,
    theme: 'striped',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontSize: 9,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 12, halign: 'center' },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  // === BALANCES TABLE ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bakiyeler', 14, yPos);
  yPos += 8;

  const balancesData = balances.map((balance) => {
    const isPositive = balance.balance >= 0;
    return [
      balance.userName,
      formatCurrencyAmount(Math.abs(balance.balance), balance.currency),
      isPositive ? 'Alacaklı' : 'Borçlu',
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Üye', 'Bakiye', 'Durum']],
    body: balancesData,
    theme: 'striped',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontSize: 10,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'center' },
    },
    didParseCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === 'Alacaklı') {
          data.cell.styles.textColor = COLORS.success;
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = COLORS.danger;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPos > pageHeight - 70) {
    doc.addPage();
    yPos = 20;
  }

  // === SETTLEMENTS TABLE ===
  if (settlements.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Önerilen Ödemeler', 14, yPos);
    yPos += 8;

    const settlementsData = settlements.map((settlement) => [
      settlement.from,
      '→',
      settlement.to,
      formatCurrencyAmount(settlement.amount, settlement.currency),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Borçlu', '', 'Alacaklı', 'Tutar']],
      body: settlementsData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.warning,
        textColor: COLORS.white,
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
      },
      columnStyles: {
        1: { cellWidth: 10, halign: 'center' },
        3: { halign: 'right', fontStyle: 'bold' },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // === SUMMARY BOX ===
  if (yPos > pageHeight - 50) {
    doc.addPage();
    yPos = 20;
  }

  const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpense = totalExpenses / group.expenses.length || 0;

  doc.setFillColor(COLORS.light);
  doc.roundedRect(14, yPos, pageWidth - 28, 35, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.dark);
  doc.text('Özet', 20, yPos + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Toplam Harcama Tutarı: ${formatCurrencyAmount(totalExpenses, group.currency || 'TRY')}`, 20, yPos + 18);
  doc.text(`Ortalama Harcama: ${formatCurrencyAmount(avgExpense, group.currency || 'TRY')}`, 20, yPos + 25);
  doc.text(`En Yüksek Harcama: ${formatCurrencyAmount(Math.max(...group.expenses.map(e => e.amount), 0), group.currency || 'TRY')}`, 20, yPos + 32);

  // === FOOTER ===
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Sayfa ${i} / ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'Payça ile oluşturuldu - https://payca.app',
      pageWidth - 14,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  return doc.output('blob');
}

/**
 * Generate simple expense summary PDF
 */
export async function generateExpenseSummaryPDF(
  expenses: ExpenseForPDF[],
  title: string = 'Harcama Özeti'
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('tr-TR');
  doc.text(`Rapor Tarihi: ${today}`, 14, yPos);
  yPos += 15;

  // Expenses table
  const expensesData = expenses.map((expense) => {
    const date = new Date(expense.date).toLocaleDateString('tr-TR');
    return [
      date,
      expense.description,
      expense.paidBy.name,
      formatCurrencyAmount(expense.amount, expense.currency),
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Tarih', 'Açıklama', 'Ödeyen', 'Tutar']],
    body: expensesData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
    },
  });

  return doc.output('blob');
}

/**
 * Download PDF file
 */
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download group report
 */
export async function exportGroupReport(
  group: GroupForPDF,
  balances: BalanceForPDF[],
  settlements: SettlementForPDF[]
): Promise<void> {
  const pdfBlob = await generateGroupPDF(group, balances, settlements);
  const filename = `Payca_${group.name}_${new Date().toISOString().split('T')[0]}.pdf`;
  downloadPDF(pdfBlob, filename);
}
