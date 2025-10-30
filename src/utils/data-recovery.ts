/**
 * Data Recovery Utilities for Payça App
 * Helps recover and migrate localStorage data
 */

export interface RecurringExpense {
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
 * Find all recurring expense keys in localStorage
 */
export function findAllRecurringExpenseKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('payca-recurring-')) {
            keys.push(key);
        }
    }
    return keys;
}

/**
 * Get all recurring expense data from all groups
 */
export function getAllRecurringExpenses(): Map<string, RecurringExpense[]> {
    const allData = new Map<string, RecurringExpense[]>();
    const keys = findAllRecurringExpenseKeys();

    keys.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const expenses: RecurringExpense[] = JSON.parse(data);
                allData.set(key, expenses);
            }
        } catch (error) {
            console.error(`Error parsing data from ${key}:`, error);
        }
    });

    return allData;
}

/**
 * Export all recurring expenses to a JSON file
 */
export function exportRecurringExpensesBackup(): string {
    const allData = getAllRecurringExpenses();
    const backup: { [key: string]: RecurringExpense[] } = {};

    allData.forEach((expenses, key) => {
        backup[key] = expenses;
    });

    return JSON.stringify(backup, null, 2);
}

/**
 * Import recurring expenses from a backup JSON string
 */
export function importRecurringExpensesBackup(jsonString: string): boolean {
    try {
        const backup: { [key: string]: RecurringExpense[] } = JSON.parse(jsonString);

        Object.entries(backup).forEach(([key, expenses]) => {
            if (key.startsWith('payca-recurring-')) {
                localStorage.setItem(key, JSON.stringify(expenses));
                console.log(`Restored ${expenses.length} expenses to ${key}`);
            }
        });

        return true;
    } catch (error) {
        console.error('Error importing backup:', error);
        return false;
    }
}

/**
 * Migrate recurring expenses from one group to another
 */
export function migrateRecurringExpenses(fromGroupId: number, toGroupId: number): boolean {
    try {
        const fromKey = `payca-recurring-${fromGroupId}`;
        const toKey = `payca-recurring-${toGroupId}`;

        const data = localStorage.getItem(fromKey);
        if (!data) {
            console.error(`No data found for group ${fromGroupId}`);
            return false;
        }

        const expenses: RecurringExpense[] = JSON.parse(data);

        // Update group IDs
        const migratedExpenses = expenses.map(exp => ({
            ...exp,
            groupId: toGroupId
        }));

        localStorage.setItem(toKey, JSON.stringify(migratedExpenses));
        console.log(`Migrated ${migratedExpenses.length} expenses from group ${fromGroupId} to ${toGroupId}`);

        return true;
    } catch (error) {
        console.error('Error migrating data:', error);
        return false;
    }
}

/**
 * Get diagnostic information about localStorage
 */
export function getDiagnosticInfo(): {
    totalKeys: number;
    paycaKeys: number;
    recurringKeys: number;
    totalRecurringExpenses: number;
    storageUsage: string;
} {
    const allKeys = Object.keys(localStorage);
    const paycaKeys = allKeys.filter(k => k.toLowerCase().includes('payca'));
    const recurringKeys = findAllRecurringExpenseKeys();

    let totalExpenses = 0;
    recurringKeys.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const expenses: RecurringExpense[] = JSON.parse(data);
                totalExpenses += expenses.length;
            }
        } catch (e) {
            // Ignore parse errors
        }
    });

    // Calculate approximate storage usage
    let storageSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const value = localStorage.getItem(key);
            storageSize += key.length + (value?.length || 0);
        }
    }
    const storageMB = (storageSize / (1024 * 1024)).toFixed(2);

    return {
        totalKeys: localStorage.length,
        paycaKeys: paycaKeys.length,
        recurringKeys: recurringKeys.length,
        totalRecurringExpenses: totalExpenses,
        storageUsage: `${storageMB} MB`
    };
}

/**
 * Console helper - print diagnostic info
 */
export function printDiagnostics(): void {
    console.group('📊 Payça Data Diagnostics');

    const info = getDiagnosticInfo();
    console.log('Total localStorage keys:', info.totalKeys);
    console.log('Payça-related keys:', info.paycaKeys);
    console.log('Recurring expense keys:', info.recurringKeys);
    console.log('Total recurring expenses:', info.totalRecurringExpenses);
    console.log('Storage usage:', info.storageUsage);

    console.groupEnd();

    console.group('📦 Recurring Expense Data');
    const allData = getAllRecurringExpenses();
    allData.forEach((expenses, key) => {
        console.log(`\n${key}: ${expenses.length} expenses`);
        console.table(expenses);
    });
    console.groupEnd();
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
    (window as any).PaycaDebug = {
        printDiagnostics,
        exportBackup: exportRecurringExpensesBackup,
        importBackup: importRecurringExpensesBackup,
        migrateExpenses: migrateRecurringExpenses,
        getDiagnosticInfo,
        getAllRecurringExpenses
    };

    console.log('%c💡 Payça Debug Tools Loaded', 'color: #4F46E5; font-weight: bold; font-size: 14px;');
    console.log('Kullanılabilir komutlar:');
    console.log('  - PaycaDebug.printDiagnostics() - Tüm verileri göster');
    console.log('  - PaycaDebug.exportBackup() - Yedek oluştur');
    console.log('  - PaycaDebug.importBackup(jsonString) - Yedeği geri yükle');
    console.log('  - PaycaDebug.migrateExpenses(fromGroupId, toGroupId) - Veriyi taşı');
    console.log('  - PaycaDebug.getDiagnosticInfo() - Özet bilgi');
}
