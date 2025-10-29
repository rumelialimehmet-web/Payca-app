import React, { useState, useMemo } from 'react';

interface Notification {
  id: string;
  type: 'expense' | 'payment_request' | 'group_invite' | 'payment_confirmed' | 'reminder' | 'weekly_summary';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  groupName?: string;
  amount?: number;
  actionData?: {
    groupId?: string;
    paymentId?: string;
    inviteId?: string;
  };
}

interface ModernNotificationsCenterProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onAcceptInvite?: (inviteId: string) => void;
  onDeclineInvite?: (inviteId: string) => void;
  onPaymentAction?: (paymentId: string, action: 'accept' | 'decline') => void;
  onNotificationClick?: (notification: Notification) => void;
}

const ModernNotificationsCenter: React.FC<ModernNotificationsCenterProps> = ({
  notifications,
  onBack,
  onMarkAllRead,
  onMarkRead,
  onAcceptInvite,
  onDeclineInvite,
  onPaymentAction,
  onNotificationClick,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      expense: '💸',
      payment_request: '📨',
      group_invite: '💌',
      payment_confirmed: '✅',
      reminder: '🔔',
      weekly_summary: '📊',
    };
    return icons[type] || '📢';
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const getTimeGroup = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return 'Bu Hafta';
    return 'Daha Eski';
  };

  const filteredNotifications = useMemo(() => {
    return activeTab === 'unread'
      ? notifications.filter(n => !n.isRead)
      : notifications;
  }, [notifications, activeTab]);

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filteredNotifications.forEach(notification => {
      const group = getTimeGroup(notification.timestamp);
      if (!groups[group]) groups[group] = [];
      groups[group].push(notification);
    });
    return groups;
  }, [filteredNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationActions = (notification: Notification) => {
    if (notification.type === 'group_invite' && !notification.isRead) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAcceptInvite && notification.actionData?.inviteId) {
                onAcceptInvite(notification.actionData.inviteId);
              }
            }}
            className="py-2 px-4 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-all"
          >
            Kabul Et
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDeclineInvite && notification.actionData?.inviteId) {
                onDeclineInvite(notification.actionData.inviteId);
              }
            }}
            className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Reddet
          </button>
        </div>
      );
    }

    if (notification.type === 'payment_request' && !notification.isRead) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onPaymentAction && notification.actionData?.paymentId) {
                onPaymentAction(notification.actionData.paymentId, 'accept');
              }
            }}
            className="py-2 px-4 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-all"
          >
            Onayla
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onPaymentAction && notification.actionData?.paymentId) {
                onPaymentAction(notification.actionData.paymentId, 'decline');
              }
            }}
            className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Reddet
          </button>
        </div>
      );
    }

    return null;
  };

  const renderNotification = (notification: Notification) => {
    return (
      <div
        key={notification.id}
        onClick={() => {
          if (!notification.isRead) {
            onMarkRead(notification.id);
          }
          if (onNotificationClick) {
            onNotificationClick(notification);
          }
        }}
        className={`p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md ${
          notification.isRead
            ? 'bg-white dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600'
            : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-3xl flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {notification.message}
            </p>

            {notification.amount && (
              <div className="text-sm font-semibold text-primary mb-2">
                {notification.amount.toFixed(2)} ₺
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getRelativeTime(notification.timestamp)}
            </div>

            {/* Action Buttons */}
            {renderNotificationActions(notification)}
          </div>
        </div>
      </div>
    );
  };

  const groupOrder = ['Bugün', 'Dün', 'Bu Hafta', 'Daha Eski'];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Bildirimler
            </h2>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-sm text-primary font-medium hover:underline"
            >
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'all'
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Tümü
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-3 text-sm font-medium transition-all relative ${
              activeTab === 'unread'
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Okunmadı
            {unreadCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
            {activeTab === 'unread' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Bildirim Yok
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'unread'
                ? 'Tüm bildirimler okundu!'
                : 'Henüz bildiriminiz bulunmuyor.'}
            </p>
          </div>
        ) : (
          groupOrder
            .filter(group => groupedNotifications[group]?.length > 0)
            .map(group => (
              <div key={group}>
                {/* Time Group Header */}
                <div className="sticky top-[121px] bg-background-light dark:bg-background-dark py-2 mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {group}
                  </h3>
                </div>

                {/* Notifications in this group */}
                <div className="space-y-3">
                  {groupedNotifications[group].map(notification =>
                    renderNotification(notification)
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ModernNotificationsCenter;
