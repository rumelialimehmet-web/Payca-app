import React, { useState, useRef } from 'react';
import { scanReceipt } from '../lib/gemini';

interface ReceiptScannerProps {
    onClose: () => void;
    onScanComplete: (data: {
        amount: number;
        date: string;
        merchantName: string;
        category: string;
        items?: Array<{ name: string; price: number }>;
    }) => void;
}

export function ReceiptScanner({ onClose, onScanComplete }: ReceiptScannerProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scannedData, setScannedData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, WebP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const handleScan = async () => {
        if (!selectedImage) {
            setError('Lütfen önce bir fatura resmi seçin');
            return;
        }

        setScanning(true);
        setError(null);

        const result = await scanReceipt(selectedImage);

        setScanning(false);

        if (result.success && result.data) {
            setScannedData(result.data);
        } else {
            setError(result.error || 'Fatura taranırken bir hata oluştu');
        }
    };

    const handleUseData = () => {
        if (scannedData) {
            onScanComplete(scannedData);
            onClose();
        }
    };

    const handleRetry = () => {
        setSelectedImage(null);
        setScannedData(null);
        setError(null);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content receipt-scanner-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>📷 Fatura Tara</h2>

                {!selectedImage && !scannedData && (
                    <div className="scanner-input-section">
                        <p className="scanner-description">
                            {isMobile
                                ? 'Faturanızın fotoğrafını çekin veya galerinizden yükleyin.'
                                : 'Fatura resmini bilgisayarınızdan yükleyin.'
                            }
                            {' '}Yapay zeka faturadaki bilgileri otomatik olarak çıkaracak.
                        </p>

                        <div className="scanner-buttons">
                            {isMobile && (
                                <>
                                    <input
                                        ref={cameraInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        className="scanner-button camera-button"
                                        onClick={() => cameraInputRef.current?.click()}
                                    >
                                        <span className="scanner-button-icon">📸</span>
                                        <span className="scanner-button-label">Kamera ile Çek</span>
                                    </button>
                                </>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="scanner-button upload-button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="scanner-button-icon">📁</span>
                                <span className="scanner-button-label">{isMobile ? 'Galeriden Seç' : 'Dosya Seç'}</span>
                            </button>
                        </div>

                        <div className="scanner-tips">
                            <p><strong>İpuçları:</strong></p>
                            <ul>
                                <li>✓ Faturayı iyi aydınlatılmış bir yerde çekin</li>
                                <li>✓ Tüm fatura görüntüde olsun</li>
                                <li>✓ Bulanık olmadığından emin olun</li>
                                <li>✓ JPEG, PNG veya WebP formatı kullanın</li>
                            </ul>
                        </div>
                    </div>
                )}

                {selectedImage && !scannedData && (
                    <div className="scanner-preview-section">
                        <div className="scanner-preview">
                            <img src={selectedImage} alt="Fatura önizleme" />
                        </div>

                        {error && (
                            <div className="scanner-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="scanner-actions">
                            <button
                                className="secondary-button"
                                onClick={handleRetry}
                                disabled={scanning}
                            >
                                Farklı Resim Seç
                            </button>
                            <button
                                className="form-button"
                                onClick={handleScan}
                                disabled={scanning}
                            >
                                {scanning ? (
                                    <>
                                        <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }}></span>
                                        Taranıyor...
                                    </>
                                ) : (
                                    '🤖 AI ile Tara'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {scannedData && (
                    <div className="scanner-result-section">
                        <div className="scanner-success-banner">
                            <span className="success-icon">✅</span>
                            <span>Fatura başarıyla tarandı!</span>
                        </div>

                        <div className="scanned-data-cards">
                            {scannedData.merchantName && (
                                <div className="scanned-data-card">
                                    <div className="scanned-data-label">İşletme</div>
                                    <div className="scanned-data-value">{scannedData.merchantName}</div>
                                </div>
                            )}

                            {scannedData.amount && (
                                <div className="scanned-data-card highlight">
                                    <div className="scanned-data-label">Toplam Tutar</div>
                                    <div className="scanned-data-value">
                                        ₺{scannedData.amount.toFixed(2)}
                                    </div>
                                </div>
                            )}

                            {scannedData.date && (
                                <div className="scanned-data-card">
                                    <div className="scanned-data-label">Tarih</div>
                                    <div className="scanned-data-value">{scannedData.date}</div>
                                </div>
                            )}

                            {scannedData.category && (
                                <div className="scanned-data-card">
                                    <div className="scanned-data-label">Kategori</div>
                                    <div className="scanned-data-value">
                                        {scannedData.category === 'food' && '🍔 Yemek'}
                                        {scannedData.category === 'transport' && '🚗 Ulaşım'}
                                        {scannedData.category === 'entertainment' && '🎉 Eğlence'}
                                        {scannedData.category === 'bills' && '💡 Faturalar'}
                                        {scannedData.category === 'other' && '📦 Diğer'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {scannedData.items && scannedData.items.length > 0 && (
                            <div className="scanned-items">
                                <h4>Ürünler</h4>
                                <div className="scanned-items-list">
                                    {scannedData.items.map((item: any, index: number) => (
                                        <div key={index} className="scanned-item">
                                            <span className="scanned-item-name">{item.name}</span>
                                            <span className="scanned-item-price">₺{item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="scanner-actions">
                            <button
                                className="secondary-button"
                                onClick={handleRetry}
                            >
                                Yeni Fatura Tara
                            </button>
                            <button
                                className="form-button"
                                onClick={handleUseData}
                            >
                                ✅ Harcama Olarak Ekle
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
