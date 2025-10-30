import React, { useState } from 'react';

interface PaymentDetailProps {
  payment: {
    id: string;
    amount: number;
    from: {
      id: string;
      name: string;
      avatar?: string;
    };
    to: {
      id: string;
      name: string;
      avatar?: string;
    };
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    completedAt?: string;
    method?: 'cash' | 'bank' | 'paypal' | 'crypto';
    note?: string;
    groupName?: string;
  };
  onBack: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ModernPaymentDetail: React.FC<PaymentDetailProps> = ({
  payment,
  onBack,
  onConfirm,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(payment.method || 'cash');
  const [showMethodSelector, setShowMethodSelector] = useState(false);

  const getStatusBadge = () => {
    const badges = {
      pending: { text: 'Beklemede', color: 'bg-yellow-500', icon: 'schedule' },
      completed: { text: 'Tamamlandı', color: 'bg-green-500', icon: 'check_circle' },
      cancelled: { text: 'İptal Edildi', color: 'bg-red-500', icon: 'cancel' },
    };
    return badges[payment.status];
  };

  const paymentMethods: Array<{ id: 'cash' | 'bank' | 'paypal' | 'crypto'; name: string; icon: string }> = [
    { id: 'cash', name: 'Nakit', icon: 'payments' },
    { id: 'bank', name: 'Banka Transferi', icon: 'account_balance' },
    { id: 'paypal', name: 'PayPal', icon: 'credit_card' },
    { id: 'crypto', name: 'Kripto Para', icon: 'currency_bitcoin' },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const badge = getStatusBadge();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-br from-primary to-purple-600 text-white pt-16 pb-32">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <span className="material-icons">arrow_back</span>
        </button>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <div className={`${badge.color} px-4 py-2 rounded-full flex items-center gap-2`}>
            <span className="material-icons text-sm">{badge.icon}</span>
            <span className="text-sm font-medium">{badge.text}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">
            {payment.amount.toFixed(2)} ₺
          </div>
          {payment.groupName && (
            <div className="text-white/80 text-sm">
              {payment.groupName} grubundan
            </div>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative -mt-24 px-4 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-6">

          {/* Payer and Receiver */}
          <div className="space-y-4">
            {/* From */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {payment.from.avatar ? (
                  <img src={payment.from.avatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  payment.from.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Gönderen</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {payment.from.name}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="material-icons text-gray-600 dark:text-gray-300">
                  arrow_downward
                </span>
              </div>
            </div>

            {/* To */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                {payment.to.avatar ? (
                  <img src={payment.to.avatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  payment.to.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Alıcı</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {payment.to.name}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Payment Method */}
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Ödeme Yöntemi
            </div>
            <button
              onClick={() => payment.status === 'pending' && setShowMethodSelector(!showMethodSelector)}
              disabled={payment.status !== 'pending'}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons text-primary">
                  {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
              {payment.status === 'pending' && (
                <span className="material-icons text-gray-400">
                  {showMethodSelector ? 'expand_less' : 'expand_more'}
                </span>
              )}
            </button>

            {/* Method Selector */}
            {showMethodSelector && payment.status === 'pending' && (
              <div className="mt-3 space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setShowMethodSelector(false);
                    }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                      selectedMethod === method.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="material-icons">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          {payment.note && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Not
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {payment.note}
                </div>
              </div>
            </>
          )}

          {/* Transaction Timeline */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              İşlem Geçmişi
            </div>
            <div className="space-y-4">
              {/* Created */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-blue-600 dark:text-blue-300 text-sm">
                    add_circle
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    Ödeme Oluşturuldu
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>

              {/* Completed */}
              {payment.completedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-green-600 dark:text-green-300 text-sm">
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Ödeme Tamamlandı
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(payment.completedAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction ID */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              İşlem No
            </div>
            <div className="text-sm font-mono text-gray-900 dark:text-white">
              {payment.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {payment.status === 'pending' && (
          <div className="mt-6 space-y-3">
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <span className="material-icons">check_circle</span>
                Ödemeyi Onayla
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-4 rounded-2xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
              >
                İptal Et
              </button>
            )}
          </div>
        )}

        {/* Completed/Cancelled Message */}
        {payment.status !== 'pending' && (
          <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center">
            <span className="material-icons text-4xl mb-2 text-gray-400">
              {payment.status === 'completed' ? 'task_alt' : 'block'}
            </span>
            <div className="text-gray-900 dark:text-white font-medium">
              {payment.status === 'completed'
                ? 'Bu ödeme tamamlanmıştır'
                : 'Bu ödeme iptal edilmiştir'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernPaymentDetail;
