/**
 * Form Validation Utilities
 * Comprehensive validation functions with Turkish error messages
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
    if (!email || email.trim() === '') {
        return { isValid: false, error: 'E-posta adresi gerekli' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Geçerli bir e-posta adresi girin' };
    }

    return { isValid: true };
};

/**
 * Password validation
 */
export const validatePassword = (password: string): ValidationResult => {
    if (!password || password.trim() === '') {
        return { isValid: false, error: 'Şifre gerekli' };
    }

    if (password.length < 6) {
        return { isValid: false, error: 'Şifre en az 6 karakter olmalı' };
    }

    return { isValid: true };
};

/**
 * Required field validation
 */
export const validateRequired = (value: string | number, fieldName: string = 'Bu alan'): ValidationResult => {
    if (value === undefined || value === null || String(value).trim() === '') {
        return { isValid: false, error: `${fieldName} gerekli` };
    }

    return { isValid: true };
};

/**
 * Number validation (positive numbers only)
 */
export const validatePositiveNumber = (value: number | string, fieldName: string = 'Tutar'): ValidationResult => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return { isValid: false, error: `${fieldName} sayı olmalı` };
    }

    if (numValue <= 0) {
        return { isValid: false, error: `${fieldName} sıfırdan büyük olmalı` };
    }

    return { isValid: true };
};

/**
 * Amount validation (money)
 */
export const validateAmount = (amount: number | string): ValidationResult => {
    const result = validatePositiveNumber(amount, 'Tutar');
    if (!result.isValid) return result;

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Check for reasonable amount (not more than 1 million TL)
    if (numAmount > 1000000) {
        return { isValid: false, error: 'Tutar çok yüksek (max 1.000.000 ₺)' };
    }

    // Check for too many decimal places
    const decimalPlaces = (String(numAmount).split('.')[1] || '').length;
    if (decimalPlaces > 2) {
        return { isValid: false, error: 'En fazla 2 ondalık basamak kullanın' };
    }

    return { isValid: true };
};

/**
 * Name validation (min 2 characters)
 */
export const validateName = (name: string, fieldName: string = 'İsim'): ValidationResult => {
    if (!name || name.trim() === '') {
        return { isValid: false, error: `${fieldName} gerekli` };
    }

    if (name.trim().length < 2) {
        return { isValid: false, error: `${fieldName} en az 2 karakter olmalı` };
    }

    if (name.length > 50) {
        return { isValid: false, error: `${fieldName} çok uzun (max 50 karakter)` };
    }

    return { isValid: true };
};

/**
 * Phone validation (Turkish phone numbers)
 */
export const validatePhone = (phone: string): ValidationResult => {
    if (!phone || phone.trim() === '') {
        return { isValid: true }; // Phone is optional
    }

    // Remove spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Turkish phone number: starts with 0 or +90, followed by 10 digits
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;

    if (!phoneRegex.test(cleaned)) {
        return { isValid: false, error: 'Geçerli bir telefon numarası girin (örn: 0555 123 4567)' };
    }

    return { isValid: true };
};

/**
 * Date validation
 */
export const validateDate = (date: string): ValidationResult => {
    if (!date || date.trim() === '') {
        return { isValid: false, error: 'Tarih gerekli' };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return { isValid: false, error: 'Geçerli bir tarih girin' };
    }

    // Check if date is not in the future (for expenses)
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (dateObj > today) {
        return { isValid: false, error: 'Gelecek tarihli harcama eklenemez' };
    }

    return { isValid: true };
};

/**
 * Group name validation
 */
export const validateGroupName = (name: string): ValidationResult => {
    if (!name || name.trim() === '') {
        return { isValid: false, error: 'Grup adı gerekli' };
    }

    if (name.trim().length < 3) {
        return { isValid: false, error: 'Grup adı en az 3 karakter olmalı' };
    }

    if (name.length > 50) {
        return { isValid: false, error: 'Grup adı çok uzun (max 50 karakter)' };
    }

    return { isValid: true };
};

/**
 * Members validation (at least one member)
 */
export const validateMembers = (members: Array<{ name: string }>): ValidationResult => {
    const validMembers = members.filter(m => m.name.trim() !== '');

    if (validMembers.length === 0) {
        return { isValid: false, error: 'En az 1 üye eklemelisiniz' };
    }

    // Check for duplicate names
    const names = validMembers.map(m => m.name.trim().toLowerCase());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
        return { isValid: false, error: 'Aynı isimde birden fazla üye olamaz' };
    }

    return { isValid: true };
};

/**
 * Custom split validation
 */
export const validateCustomSplit = (
    splits: Array<{ memberId: number; amount: string | number }>,
    totalAmount: number
): ValidationResult => {
    const splitTotal = splits.reduce((sum, split) => {
        const amount = typeof split.amount === 'string' ? parseFloat(split.amount) : split.amount;
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const difference = Math.abs(totalAmount - splitTotal);

    if (difference > 0.01) {
        return {
            isValid: false,
            error: `Paylaşım toplamı harcama tutarına eşit olmalı (Fark: ${difference.toFixed(2)} ₺)`
        };
    }

    return { isValid: true };
};

/**
 * Validate entire form
 */
export const validateForm = (
    fields: Record<string, any>,
    validators: Record<string, (value: any) => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validators).forEach(fieldName => {
        const validator = validators[fieldName];
        const value = fields[fieldName];
        const result = validator(value);

        if (!result.isValid) {
            errors[fieldName] = result.error || 'Geçersiz değer';
            isValid = false;
        }
    });

    return { isValid, errors };
};
