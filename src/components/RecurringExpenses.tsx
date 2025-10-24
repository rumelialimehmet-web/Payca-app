import React, { useState, useEffect } from 'react';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(amount);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
};

const frequencyLabels: { [key: string]: string } = {
    daily: 'Her Gün',
    weekly: 'Her Hafta',
    monthly: 'Her Ay'
};

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

interface RecurringExpensesProps {
    group: any;
    currentUser: any;
    onClose: () => void;
}

export function RecurringExpenses({ group, currentUser, onClose }: RecurringExpensesProps) {
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        paidBy: currentUser.id,
        frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true
    });

    // Load recurring expenses from localStorage
    useEffect(() => {
        const storageKey = `payca-recurring-${group.id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setRecurringExpenses(JSON.parse(stored));
        }
    }, [group.id]);

    // Save to localStorage
    const saveRecurringExpenses = (expenses: RecurringExpense[]) => {
        const storageKey = `payca-recurring-${group.id}`;
        localStorage.setItem(storageKey, JSON.stringify(expenses));
        setRecurringExpenses(expenses);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = parseFloat(formData.amount);
        if (!formData.description || !amount || amount <= 0) {
            alert('Lütfen tüm alanları doğru doldurun.');
            return;
        }

        const newExpense: RecurringExpense = {
            id: editingId || Date.now().toString(),
            groupId: group.id,
            description: formData.description,
            amount: amount,
            paidBy: parseInt(formData.paidBy as any),
            frequency: formData.frequency,
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
            lastCreated: undefined,
            isActive: formData.isActive
        };

        if (editingId) {
            // Update existing
            const updated = recurringExpenses.map(exp =>
                exp.id === editingId ? newExpense : exp
            );
            saveRecurringExpenses(updated);
        } else {
            // Add new
            saveRecurringExpenses([...recurringExpenses, newExpense]);
        }

        // Reset form
        setFormData({
            description: '',
            amount: '',
            paidBy: currentUser.id,
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isActive: true
        });
        setShowForm(false);
        setEditingId(null);
    };

    const handleEdit = (expense: RecurringExpense) => {
        setFormData({
            description: expense.description,
            amount: expense.amount.toString(),
            paidBy: expense.paidBy,
            frequency: expense.frequency,
            startDate: expense.startDate,
            endDate: expense.endDate || '',
            isActive: expense.isActive
        });
        setEditingId(expense.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu tekrarlayan harcamayı silmek istediğinizden emin misiniz?')) {
            const updated = recurringExpenses.filter(exp => exp.id !== id);
            saveRecurringExpenses(updated);
        }
    };

    const handleToggleActive = (id: string) => {
        const updated = recurringExpenses.map(exp =>
            exp.id === id ? { ...exp, isActive: !exp.isActive } : exp
        );
        saveRecurringExpenses(updated);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>🔁 Tekrarlayan Harcamalar</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Kira, fatura gibi düzenli ödemelerinizi otomatik olarak ekleyin
                </p>

                {!showForm && (
                    <button
                        className="cta-button"
                        onClick={() => setShowForm(true)}
                        style={{ marginBottom: '20px' }}
                    >
                        + Yeni Tekrarlayan Harcama
                    </button>
                )}

                {showForm && (
                    <div className="detail-card" style={{ marginBottom: '20px' }}>
                        <h3>{editingId ? 'Düzenle' : 'Yeni Tekrarlayan Harcama'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="description">Açıklama</label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Örn: Kira, Elektrik Faturası"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount">Tutar (₺)</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="paidBy">Kim ödeyecek?</label>
                                <select
                                    id="paidBy"
                                    name="paidBy"
                                    value={formData.paidBy}
                                    onChange={handleInputChange}
                                >
                                    {group.members.map((member: any) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="frequency">Tekrar Sıklığı</label>
                                <select
                                    id="frequency"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleInputChange}
                                >
                                    <option value="daily">Her Gün</option>
                                    <option value="weekly">Her Hafta</option>
                                    <option value="monthly">Her Ay</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="startDate">Başlangıç Tarihi</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDate">Bitiş Tarihi (Opsiyonel)</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    min={formData.startDate}
                                />
                                <small style={{ color: 'var(--text-secondary)' }}>
                                    Boş bırakırsanız süresiz devam eder
                                </small>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="submit" className="form-button">
                                    {editingId ? 'Güncelle' : 'Kaydet'}
                                </button>
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                        setFormData({
                                            description: '',
                                            amount: '',
                                            paidBy: currentUser.id,
                                            frequency: 'monthly',
                                            startDate: new Date().toISOString().split('T')[0],
                                            endDate: '',
                                            isActive: true
                                        });
                                    }}
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="detail-card">
                    <h3>Kayıtlı Tekrarlayan Harcamalar</h3>
                    {recurringExpenses.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                            Henüz tekrarlayan harcama eklenmemiş.
                        </p>
                    ) : (
                        <ul className="expense-list">
                            {recurringExpenses.map((expense) => (
                                <li key={expense.id} className="expense-item" style={{ opacity: expense.isActive ? 1 : 0.5 }}>
                                    <div className="expense-info">
                                        <p style={{ fontWeight: 600 }}>
                                            {expense.description}
                                            {!expense.isActive && <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Pasif)</span>}
                                        </p>
                                        <p className="date" style={{ fontSize: '0.85rem' }}>
                                            {frequencyLabels[expense.frequency]} •
                                            {group.members.find((m: any) => m.id === expense.paidBy)?.name || 'Bilinmiyor'} •
                                            Başlangıç: {formatDate(expense.startDate)}
                                            {expense.endDate && ` → Bitiş: ${formatDate(expense.endDate)}`}
                                        </p>
                                        {expense.lastCreated && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
                                                Son oluşturma: {formatDate(expense.lastCreated)}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="icon-button"
                                                onClick={() => handleToggleActive(expense.id)}
                                                title={expense.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                {expense.isActive ? '⏸️' : '▶️'}
                                            </button>
                                            <button
                                                className="icon-button"
                                                onClick={() => handleEdit(expense)}
                                                title="Düzenle"
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="icon-button"
                                                onClick={() => handleDelete(expense.id)}
                                                title="Sil"
                                                style={{ fontSize: '1.2rem', color: 'var(--danger-color)' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface-color-light)', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <strong>💡 Nasıl Çalışır?</strong>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                        <li>Tekrarlayan harcamalar her gün otomatik kontrol edilir</li>
                        <li>Belirlenen sıklığa göre otomatik olarak gruba harcama eklenir</li>
                        <li>İstediğiniz zaman pasif yapabilir veya düzenleyebilirsiniz</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
