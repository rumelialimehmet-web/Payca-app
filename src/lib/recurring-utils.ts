interface RecurringExpense {
    id: string;
    groupId: number;
    description: string;
    amount: number;
    paidBy: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate?: string;
    lastCreated?: string;
    isActive: boolean;
}

/**
 * Belirli bir recurring expense'in bir sonraki oluşturulma tarihini hesaplar
 */
const getNextCreationDate = (expense: RecurringExpense): Date => {
    const startDate = new Date(expense.startDate);
    const lastCreated = expense.lastCreated ? new Date(expense.lastCreated) : null;
    const baseDate = lastCreated || startDate;

    const nextDate = new Date(baseDate);

    switch (expense.frequency) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
    }

    return nextDate;
};

/**
 * Bir recurring expense'in bugün oluşturulması gerekip gerekmediğini kontrol eder
 */
const shouldCreateToday = (expense: RecurringExpense): boolean => {
    if (!expense.isActive) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(expense.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Henüz başlamamış
    if (today < startDate) return false;

    // Bitiş tarihi geçmiş
    if (expense.endDate) {
        const endDate = new Date(expense.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (today > endDate) return false;
    }

    // Hiç oluşturulmamış
    if (!expense.lastCreated) {
        return today >= startDate;
    }

    // Son oluşturma tarihi
    const lastCreated = new Date(expense.lastCreated);
    lastCreated.setHours(0, 0, 0, 0);

    // Bugün zaten oluşturulmuş
    if (today.getTime() === lastCreated.getTime()) return false;

    // Bir sonraki oluşturma tarihi
    const nextDate = getNextCreationDate(expense);
    nextDate.setHours(0, 0, 0, 0);

    return today >= nextDate;
};

/**
 * Tüm gruplar için tekrarlayan harcamaları kontrol edip gerekirse oluşturur
 */
export const processRecurringExpenses = (
    groups: any[],
    onAddExpense: (groupId: number, expense: any) => void
): number => {
    let createdCount = 0;

    groups.forEach(group => {
        const storageKey = `payca-recurring-${group.id}`;
        const stored = localStorage.getItem(storageKey);

        if (!stored) return;

        const recurringExpenses: RecurringExpense[] = JSON.parse(stored);
        const updatedExpenses: RecurringExpense[] = [];

        recurringExpenses.forEach(expense => {
            if (shouldCreateToday(expense)) {
                // Yeni harcama oluştur
                const newExpense = {
                    description: `${expense.description} (Otomatik)`,
                    amount: expense.amount,
                    paidBy: expense.paidBy,
                    splitType: 'equal',
                    splits: []
                };

                onAddExpense(group.id, newExpense);

                // LastCreated tarihini güncelle
                const updatedExpense = {
                    ...expense,
                    lastCreated: new Date().toISOString()
                };
                updatedExpenses.push(updatedExpense);
                createdCount++;

                console.log(`[Recurring] Created expense: ${expense.description} for group ${group.name}`);
            } else {
                updatedExpenses.push(expense);
            }
        });

        // localStorage'ı güncelle
        localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    });

    return createdCount;
};

/**
 * Son kontrol tarihini saklar
 */
export const getLastCheckDate = (): string | null => {
    return localStorage.getItem('payca-recurring-last-check');
};

export const setLastCheckDate = (date: string) => {
    localStorage.setItem('payca-recurring-last-check', date);
};

/**
 * Bugün kontrol edilmiş mi?
 */
export const wasCheckedToday = (): boolean => {
    const lastCheck = getLastCheckDate();
    if (!lastCheck) return false;

    const lastCheckDate = new Date(lastCheck);
    const today = new Date();

    return (
        lastCheckDate.getDate() === today.getDate() &&
        lastCheckDate.getMonth() === today.getMonth() &&
        lastCheckDate.getFullYear() === today.getFullYear()
    );
};
