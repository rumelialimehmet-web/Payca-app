import React, { useState, useCallback } from 'react';
import { ValidationResult } from '../lib/validation';

interface FieldState {
    value: any;
    error: string | null;
    touched: boolean;
}

interface UseFormValidationOptions<T> {
    initialValues: T;
    validators?: Partial<Record<keyof T, (value: any) => ValidationResult>>;
    onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Custom hook for form validation with real-time feedback
 */
export function useFormValidation<T extends Record<string, any>>(
    options: UseFormValidationOptions<T>
) {
    const { initialValues, validators = {}, onSubmit } = options;

    // Initialize field states
    const initialState: Record<keyof T, FieldState> = {} as any;
    Object.keys(initialValues).forEach(key => {
        initialState[key as keyof T] = {
            value: initialValues[key as keyof T],
            error: null,
            touched: false
        };
    });

    const [fields, setFields] = useState<Record<keyof T, FieldState>>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Get current form values
     */
    const getValues = useCallback((): T => {
        const values = {} as T;
        Object.keys(fields).forEach(key => {
            values[key as keyof T] = fields[key as keyof T].value;
        });
        return values;
    }, [fields]);

    /**
     * Validate a single field
     */
    const validateField = useCallback((fieldName: keyof T, value: any): string | null => {
        const validator = (validators as any)[fieldName];
        if (!validator || typeof validator !== 'function') return null;

        const result = validator(value);
        return result.isValid ? null : (result.error || 'Geçersiz değer');
    }, [validators]);

    /**
     * Handle field change
     */
    const handleChange = useCallback((fieldName: keyof T, value: any) => {
        setFields(prev => ({
            ...prev,
            [fieldName]: {
                value,
                error: prev[fieldName].touched ? validateField(fieldName, value) : null,
                touched: prev[fieldName].touched
            }
        }));
    }, [validateField]);

    /**
     * Handle field blur (mark as touched and validate)
     */
    const handleBlur = useCallback((fieldName: keyof T) => {
        setFields(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                error: validateField(fieldName, prev[fieldName].value),
                touched: true
            }
        }));
    }, [validateField]);

    /**
     * Validate all fields
     */
    const validateAll = useCallback((): boolean => {
        let isValid = true;
        const newFields = { ...fields };

        Object.keys(fields).forEach(key => {
            const fieldName = key as keyof T;
            const error = validateField(fieldName, fields[fieldName].value);

            newFields[fieldName] = {
                ...fields[fieldName],
                error,
                touched: true
            };

            if (error) {
                isValid = false;
            }
        });

        setFields(newFields);
        return isValid;
    }, [fields, validateField]);

    /**
     * Handle form submit
     */
    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        const isValid = validateAll();
        if (!isValid) {
            return;
        }

        if (onSubmit) {
            setIsSubmitting(true);
            try {
                await onSubmit(getValues());
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [validateAll, onSubmit, getValues]);

    /**
     * Reset form to initial values
     */
    const reset = useCallback(() => {
        const resetState: Record<keyof T, FieldState> = {} as any;
        Object.keys(initialValues).forEach(key => {
            resetState[key as keyof T] = {
                value: initialValues[key as keyof T],
                error: null,
                touched: false
            };
        });
        setFields(resetState);
    }, [initialValues]);

    /**
     * Set a specific field error (useful for server-side validation)
     */
    const setFieldError = useCallback((fieldName: keyof T, error: string) => {
        setFields(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                error,
                touched: true
            }
        }));
    }, []);

    /**
     * Get field props for input components
     */
    const getFieldProps = useCallback((fieldName: keyof T) => {
        const field = fields[fieldName];
        return {
            value: field.value,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                const value = e.target.type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : e.target.value;
                handleChange(fieldName, value);
            },
            onBlur: () => handleBlur(fieldName),
            'aria-invalid': field.touched && field.error ? 'true' : 'false',
            'aria-describedby': field.error ? `${String(fieldName)}-error` : undefined
        };
    }, [fields, handleChange, handleBlur]);

    /**
     * Check if form has any errors
     */
    const hasErrors = useCallback((): boolean => {
        return Object.values(fields).some(field => field.error !== null);
    }, [fields]);

    /**
     * Check if form has been modified
     */
    const isDirty = useCallback((): boolean => {
        return Object.keys(fields).some(key => {
            const fieldName = key as keyof T;
            return fields[fieldName].value !== initialValues[fieldName];
        });
    }, [fields, initialValues]);

    return {
        fields,
        values: getValues(),
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setFieldError,
        getFieldProps,
        validateAll,
        hasErrors: hasErrors(),
        isDirty: isDirty()
    };
}
