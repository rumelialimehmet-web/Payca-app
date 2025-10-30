/**
 * Analytics Event Tracking Utilities
 *
 * Usage:
 * import { trackEvent } from './lib/analytics';
 * trackEvent('expense_added', { amount: 150, category: 'food' });
 */

import { track } from '@vercel/analytics';

// Event Types for Type Safety
export type AnalyticsEvent =
  // Authentication Events
  | 'signup_completed'
  | 'login_completed'
  | 'logout'

  // Group Events
  | 'group_created'
  | 'group_joined'
  | 'group_deleted'
  | 'group_shared'

  // Expense Events
  | 'expense_added'
  | 'expense_edited'
  | 'expense_deleted'
  | 'receipt_scanned'
  | 'recurring_expense_created'

  // Settlement Events
  | 'settlement_initiated'
  | 'settlement_completed'
  | 'settlement_rejected'

  // AI Features
  | 'ai_advisor_opened'
  | 'ai_advisor_question_asked'
  | 'receipt_ocr_used'

  // Export Events
  | 'excel_export'
  | 'qr_code_generated'

  // UI Events
  | 'theme_changed'
  | 'settings_opened'
  | 'help_opened'

  // Premium/Monetization (Future)
  | 'premium_viewed'
  | 'premium_purchased';

export interface AnalyticsEventData {
  [key: string]: string | number | boolean | null;
}

/**
 * Track a custom analytics event
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  data?: AnalyticsEventData
): void {
  // Only track in production
  if (import.meta.env.PROD) {
    track(eventName, data);
  } else {
    console.log('[Analytics Debug]', eventName, data);
  }
}

/**
 * Track page view (for SPA navigation)
 */
export function trackPageView(pageName: string): void {
  trackEvent('page_view' as AnalyticsEvent, { page: pageName });
}

/**
 * Track user property updates
 */
export function setUserProperty(property: string, value: string | number): void {
  if (import.meta.env.PROD) {
    // Vercel Analytics doesn't have user properties API yet
    // But we can track it as an event
    trackEvent('user_property_set' as AnalyticsEvent, {
      property,
      value: String(value)
    });
  }
}

/**
 * Track error events
 */
export function trackError(
  errorName: string,
  errorMessage: string,
  metadata?: AnalyticsEventData
): void {
  trackEvent('error_occurred' as AnalyticsEvent, {
    error_name: errorName,
    error_message: errorMessage,
    ...metadata
  });
}

/**
 * Track performance metrics
 */
export function trackPerformance(
  metricName: string,
  value: number,
  unit: 'ms' | 'bytes' | 'count' = 'ms'
): void {
  trackEvent('performance_metric' as AnalyticsEvent, {
    metric: metricName,
    value,
    unit
  });
}

// Predefined tracking functions for common events
export const analytics = {
  // Authentication
  signupCompleted: (method: string) =>
    trackEvent('signup_completed', { method }),

  loginCompleted: (method: string) =>
    trackEvent('login_completed', { method }),

  // Groups
  groupCreated: (groupId: string, memberCount: number) =>
    trackEvent('group_created', { group_id: groupId, member_count: memberCount }),

  groupJoined: (groupId: string) =>
    trackEvent('group_joined', { group_id: groupId }),

  // Expenses
  expenseAdded: (amount: number, category: string, method: 'manual' | 'ocr') =>
    trackEvent('expense_added', { amount, category, method }),

  receiptScanned: (success: boolean, confidence?: number) =>
    trackEvent('receipt_scanned', confidence !== undefined ? { success, confidence } : { success }),

  // AI Features
  aiAdvisorOpened: () =>
    trackEvent('ai_advisor_opened'),

  aiQuestionAsked: (questionType: string) =>
    trackEvent('ai_advisor_question_asked', { question_type: questionType }),

  // Settlement
  settlementCompleted: (amount: number, participantCount: number) =>
    trackEvent('settlement_completed', { amount, participant_count: participantCount }),

  // Export
  excelExported: (groupCount: number, expenseCount: number) =>
    trackEvent('excel_export', { group_count: groupCount, expense_count: expenseCount }),

  // UI
  themeChanged: (theme: string) =>
    trackEvent('theme_changed', { theme }),

  // Errors
  error: (name: string, message: string, metadata?: AnalyticsEventData) =>
    trackError(name, message, metadata)
};

export default analytics;
