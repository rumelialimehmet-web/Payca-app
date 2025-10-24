import * as XLSX from 'xlsx';

// Türkçe para formatı
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(amount);
};

// Tarih formatı
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

// Settlement hesaplama fonksiyonu (index.tsx'den alındı)
const calculateSettlements = (balances: any[]) => {
    let debtors = balances.filter(m => m.balance < 0).map(m => ({ ...m, balance: m.balance })).sort((a, b) => a.balance - b.balance);
    let creditors = balances.filter(m => m.balance > 0).map(m => ({ ...m, balance: m.balance })).sort((a, b) => b.balance - a.balance);
    const settlements = [];

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];
        const amount = Math.min(-debtor.balance, creditor.balance);

        settlements.push({
            from: debtor,
            to: creditor,
            amount: amount,
        });

        debtor.balance += amount;
        creditor.balance -= amount;

        if (Math.abs(debtor.balance) < 0.01) debtors.shift();
        if (Math.abs(creditor.balance) < 0.01) creditors.shift();
    }
    return settlements;
};

// Bakiye hesaplama fonksiyonu
const calculateBalances = (group: any) => {
    const memberBalances: { [key: string]: { id: number; name: string; balance: number } } = {};

    group.members.forEach((member: any) => {
        memberBalances[member.id] = { id: member.id, name: member.name, balance: 0 };
    });

    if (group.members.length === 0) return [];

    group.expenses.forEach((expense: any) => {
        if (memberBalances[expense.paidBy]) {
            memberBalances[expense.paidBy].balance += expense.amount;
        }

        if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
            expense.splits.forEach((split: any) => {
                if (memberBalances[split.memberId]) {
                    memberBalances[split.memberId].balance -= (split.amount || 0);
                }
            });
        } else {
            const sharePerMember = expense.amount / group.members.length;
            group.members.forEach((member: any) => {
                memberBalances[member.id].balance -= sharePerMember;
            });
        }
    });

    return Object.values(memberBalances);
};

/**
 * Tek bir grubu Excel formatında export eder
 */
export const exportGroupToExcel = (group: any) => {
    // Yeni workbook oluştur
    const wb = XLSX.utils.book_new();

    // 1. SAYFA: Harcamalar
    const expensesData = group.expenses.map((expense: any) => {
        const payer = group.members.find((m: any) => m.id === expense.paidBy);
        return {
            'Tarih': formatDate(expense.date),
            'Açıklama': expense.description,
            'Tutar': expense.amount,
            'Tutar (Formatlanmış)': formatCurrency(expense.amount),
            'Ödeyen': payer?.name || 'Bilinmiyor',
            'Paylaşım Türü': expense.splitType === 'equal' ? 'Eşit' : 'Eşit Değil'
        };
    });

    const ws1 = XLSX.utils.json_to_sheet(expensesData);

    // Kolon genişlikleri
    ws1['!cols'] = [
        { wch: 18 }, // Tarih
        { wch: 30 }, // Açıklama
        { wch: 12 }, // Tutar
        { wch: 18 }, // Tutar (Formatlanmış)
        { wch: 20 }, // Ödeyen
        { wch: 15 }  // Paylaşım Türü
    ];

    XLSX.utils.book_append_sheet(wb, ws1, 'Harcamalar');

    // 2. SAYFA: Bakiyeler
    const balances = calculateBalances(group);
    const balancesData = balances.map((b: any) => ({
        'Üye': b.name,
        'Bakiye': b.balance,
        'Bakiye (Formatlanmış)': formatCurrency(b.balance),
        'Durum': b.balance >= 0 ? 'Alacaklı' : 'Borçlu'
    }));

    const ws2 = XLSX.utils.json_to_sheet(balancesData);
    ws2['!cols'] = [
        { wch: 20 }, // Üye
        { wch: 15 }, // Bakiye
        { wch: 20 }, // Bakiye (Formatlanmış)
        { wch: 15 }  // Durum
    ];

    XLSX.utils.book_append_sheet(wb, ws2, 'Bakiyeler');

    // 3. SAYFA: Ödemeler (Settlements)
    const settlements = calculateSettlements(balances);
    const settlementsData = settlements.map((s: any) => ({
        'Borçlu': s.from.name,
        'Alacaklı': s.to.name,
        'Tutar': s.amount,
        'Tutar (Formatlanmış)': formatCurrency(s.amount),
        'Açıklama': `${s.from.name}, ${s.to.name}'e ${formatCurrency(s.amount)} ödeyebilir.`
    }));

    const ws3 = XLSX.utils.json_to_sheet(settlementsData.length > 0 ? settlementsData : [{ 'Durum': 'Tüm hesaplar eşit, ödenecek borç yok.' }]);
    ws3['!cols'] = [
        { wch: 20 }, // Borçlu
        { wch: 20 }, // Alacaklı
        { wch: 15 }, // Tutar
        { wch: 20 }, // Tutar (Formatlanmış)
        { wch: 50 }  // Açıklama
    ];

    XLSX.utils.book_append_sheet(wb, ws3, 'Ödemeler');

    // 4. SAYFA: Özet
    const totalExpenses = group.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const summaryData = [
        { 'Bilgi': 'Grup Adı', 'Değer': group.name },
        { 'Bilgi': 'Açıklama', 'Değer': group.description || '-' },
        { 'Bilgi': 'Üye Sayısı', 'Değer': group.members.length },
        { 'Bilgi': 'Toplam Harcama', 'Değer': formatCurrency(totalExpenses) },
        { 'Bilgi': 'Harcama Sayısı', 'Değer': group.expenses.length },
        { 'Bilgi': 'Kişi Başı Ortalama', 'Değer': formatCurrency(group.members.length > 0 ? totalExpenses / group.members.length : 0) },
        { 'Bilgi': 'Export Tarihi', 'Değer': new Date().toLocaleString('tr-TR') }
    ];

    const ws4 = XLSX.utils.json_to_sheet(summaryData);
    ws4['!cols'] = [
        { wch: 25 }, // Bilgi
        { wch: 40 }  // Değer
    ];

    XLSX.utils.book_append_sheet(wb, ws4, 'Özet');

    // Excel dosyasını indir
    const fileName = `Payca_${group.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

/**
 * Tüm grupları tek bir Excel dosyasına export eder
 */
export const exportAllGroupsToExcel = (groups: any[]) => {
    const wb = XLSX.utils.book_new();

    // 1. SAYFA: Tüm Gruplar Özeti
    const groupsSummaryData = groups.map((group: any) => {
        const totalExpenses = group.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
        return {
            'Grup Adı': group.name,
            'Açıklama': group.description || '-',
            'Üye Sayısı': group.members.length,
            'Harcama Sayısı': group.expenses.length,
            'Toplam Harcama': totalExpenses,
            'Toplam Harcama (Formatlanmış)': formatCurrency(totalExpenses)
        };
    });

    const ws1 = XLSX.utils.json_to_sheet(groupsSummaryData);
    ws1['!cols'] = [
        { wch: 25 }, // Grup Adı
        { wch: 30 }, // Açıklama
        { wch: 12 }, // Üye Sayısı
        { wch: 15 }, // Harcama Sayısı
        { wch: 15 }, // Toplam Harcama
        { wch: 25 }  // Toplam Harcama (Formatlanmış)
    ];

    XLSX.utils.book_append_sheet(wb, ws1, 'Grup Özeti');

    // Her grup için ayrı sayfalar
    groups.forEach((group: any, index: number) => {
        const balances = calculateBalances(group);
        const totalExpenses = group.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

        // Grup detay verisi
        const groupDetailData = [
            { 'Alan': 'Grup Adı', 'Değer': group.name },
            { 'Alan': 'Toplam Harcama', 'Değer': formatCurrency(totalExpenses) },
            { 'Alan': 'Üyeler', 'Değer': group.members.map((m: any) => m.name).join(', ') },
            { 'Alan': '', 'Değer': '' },
            { 'Alan': 'ÜYE', 'Değer': 'BAKİYE' },
            ...balances.map((b: any) => ({
                'Alan': b.name,
                'Değer': formatCurrency(b.balance)
            }))
        ];

        const ws = XLSX.utils.json_to_sheet(groupDetailData);
        ws['!cols'] = [
            { wch: 25 },
            { wch: 40 }
        ];

        // Sayfa adı maksimum 31 karakter olabilir
        const sheetName = group.name.substring(0, 28) + (group.name.length > 28 ? '...' : '');
        XLSX.utils.book_append_sheet(wb, ws, sheetName || `Grup ${index + 1}`);
    });

    // Excel dosyasını indir
    const fileName = `Payca_Tum_Gruplar_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
};
