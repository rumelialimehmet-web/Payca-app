
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { useGroups } from './src/hooks/useGroups';
import { QRCodeSVG } from 'qrcode.react';
import { ReceiptScanner } from './src/components/ReceiptScanner';
import { AIAdvisor } from './src/components/AIAdvisor';

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(amount);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const calculateSettlements = (balances) => {
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

// --- SAMPLE DATA ---
const initialGroups = [
    {
        id: 1,
        name: 'Ev Arkadaşları',
        description: 'Kira, faturalar ve ortak masraflar',
        currency: '₺',
        type: 'Ev Arkadaşları',
        members: [
            { id: 1, name: 'Ali' },
            { id: 2, name: 'Buse' },
            { id: 3, name: 'Can' },
            { id: 4, name: 'Derya' }
        ],
        expenses: [
            { id: 1, description: 'Market Alışverişi (Migros)', amount: 380.50, paidBy: 1, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), splitType: 'equal', splits: [] },
            { id: 2, description: 'Elektrik Faturası', amount: 520.00, paidBy: 2, date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), splitType: 'equal', splits: [] },
            { id: 3, description: 'İnternet Faturası', amount: 340.00, paidBy: 3, date: new Date().toISOString(), splitType: 'equal', splits: [] },
            { id: 4, description: 'Restoran (Akşam Yemeği)', amount: 850.00, paidBy: 1, date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), splitType: 'equal', splits: [] },
            { id: 5, description: 'Taksi Ücreti', amount: 120.00, paidBy: 4, date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), splitType: 'equal', splits: [] },
            { id: 6, description: 'Market (A101)', amount: 210.75, paidBy: 1, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), splitType: 'equal', splits: [] },
            { id: 7, description: 'Sinema Biletleri', amount: 400.00, paidBy: 2, date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(), splitType: 'equal', splits: [] },
        ]
    },
];

const sampleReceipts = [
    { merchant: 'Migros', total: 254.75 },
    { merchant: 'A101', total: 189.50 },
    { merchant: 'BIM', total: 312.20 },
    { merchant: 'CarrefourSA', total: 415.60 },
    { merchant: 'Şok Market', total: 155.00 },
];

// --- COMPONENTS ---
function QRCodeModal({ groupId, groupName, onClose }) {
    const groupLink = `${window.location.origin}/#/group/${groupId}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>📱 QR Kod ile Katıl</h2>
                <p style={{ marginBottom: '20px' }}>Bu QR kodu tarayarak gruba katılabilirsiniz</p>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <QRCodeSVG
                        value={groupLink}
                        size={256}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <strong>{groupName}</strong>
                </p>

                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <button
                        className="form-button"
                        onClick={() => {
                            navigator.clipboard.writeText(groupLink);
                            alert('✅ Link kopyalandı!');
                        }}
                    >
                        🔗 Linki Kopyala
                    </button>
                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}

function InstallPwaPrompt({ onInstall, onDismiss, isIOS, hasInstallEvent }) {
    return (
        <div className="install-prompt-banner">
            <div className="install-prompt-text">
                {isIOS
                    ? <p>Uygulamayı yüklemek için: Paylaş butonuna ve ardından <strong>'Ana Ekrana Ekle'</strong> seçeneğine dokunun.</p>
                    : <p>Payça'yı ana ekranınıza ekleyerek daha hızlı erişin!</p>
                }
            </div>
            <div className="install-prompt-actions">
                {hasInstallEvent && !isIOS && <button className="cta-button" onClick={onInstall}>Yükle</button>}
                <button className="dismiss-button" onClick={onDismiss} title="Kapat">&times;</button>
            </div>
        </div>
    );
}

function App() {
    // Use Supabase Auth hook
    const { user: supabaseUser, loading: authLoading, signIn, signUp, signInWithGoogle, signOut } = useAuth();

    // Adapt Supabase user to app's expected format
    const user = useMemo(() => {
        if (!supabaseUser) return null;
        return {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
        };
    }, [supabaseUser]);

    const [groups, setGroups] = useState([]);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [installPromptEvent, setInstallPromptEvent] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('payca-theme') || 'dark');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showHelpFeedbackModal, setShowHelpFeedbackModal] = useState(false);
    const [authModal, setAuthModal] = useState({ isOpen: false, view: 'login' });

    // Mobile: Bottom navigation active tab
    const [activeTab, setActiveTab] = useState('home');

    // Mobile: FAB extended state
    const [fabExpanded, setFabExpanded] = useState(false);

    // Receipt Scanner state
    const [showReceiptScanner, setShowReceiptScanner] = useState(false);

    // AI Advisor state
    const [showAIAdvisor, setShowAIAdvisor] = useState(false);

    // FIX: Add type cast to `(window as any)` to access non-standard `MSStream` property.
    const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream, []);
    const isStandalone = useMemo(() => window.matchMedia('(display-mode: standalone)').matches, []);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('payca-theme', theme);
    }, [theme]);

    // Load groups from localStorage when user logs in
    useEffect(() => {
        if (user) {
            try {
                const storedGroups = localStorage.getItem(`payca-groups-${user.id}`);
                const userGroups = storedGroups ? JSON.parse(storedGroups) : initialGroups;
                setGroups(userGroups);
            } catch (error) {
                console.error("Error loading groups from localStorage:", error);
                setGroups(initialGroups);
            }
        } else {
            setGroups([]);
        }
    }, [user]);

    // Save groups to localStorage when they change
    useEffect(() => {
        if (user && groups.length > 0) {
            localStorage.setItem(`payca-groups-${user.id}`, JSON.stringify(groups));
        }
    }, [groups, user]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
            if (!isStandalone) {
                setShowInstallPrompt(true);
            }
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        if (isIOS && !isStandalone) {
            setShowInstallPrompt(true);
        }
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, [isIOS, isStandalone]);

    const handleLogin = async (email, password) => {
        const { error } = await signIn(email, password);
        if (error) {
            console.error('Login error:', error);
            setSuccessMessage('Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
            return { error };
        }
        setAuthModal({ isOpen: false, view: 'login' });
        // Show onboarding only on first login for this user
        if (user && !localStorage.getItem(`payca-onboarding-complete-${user.id}`)) {
            setShowOnboarding(true);
        }
        return { error: null };
    };

    const handleSignup = async (email, password, displayName) => {
        const { error } = await signUp(email, password, displayName);
        if (error) {
            console.error('Signup error:', error);
            setSuccessMessage('Kayıt başarısız! Lütfen tekrar deneyin.');
            return { error };
        }
        setAuthModal({ isOpen: false, view: 'login' });
        setSuccessMessage('Kayıt başarılı! Hoş geldiniz!');
        return { error: null };
    };

    const handleGoogleLogin = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            console.error('Google login error:', error);
            setSuccessMessage('Google ile giriş başarısız!');
            return { error };
        }
        setAuthModal({ isOpen: false, view: 'login' });
        return { error: null };
    };

    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            console.error('Logout error:', error);
        }
        handleNavigate('dashboard');
    };

    const handleUpdateUser = (updatedUserData) => {
        // Note: This will need to be updated to use Supabase profile update
        // For now, just show success message
        setSuccessMessage("Profil başarıyla güncellendi!");
    }

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const handleResetData = () => {
        if (window.confirm("Tüm verileri silip başlangıç durumuna dönmek istediğinizden emin misiniz? Bu işlem, öğreticiyi de tekrar gösterecektir.")) {
            if (user) {
                localStorage.removeItem(`payca-groups-${user.id}`);
                localStorage.removeItem(`payca-onboarding-complete-${user.id}`);
            }
            setGroups(initialGroups);
            setTheme('dark');
            setSuccessMessage('Veriler başarıyla sıfırlandı.');
            handleLogout();
        }
    };

    const handleInstallClick = () => {
        if (!installPromptEvent) return;
        installPromptEvent.prompt();
        installPromptEvent.userChoice.then(() => {
            setInstallPromptEvent(null);
            setShowInstallPrompt(false);
        });
    };

    const handleNavigate = (view, groupId = null) => {
        setCurrentView(view);
        setSelectedGroupId(groupId);
    };

    const handleOnboardingComplete = () => {
        if (user) {
            localStorage.setItem(`payca-onboarding-complete-${user.id}`, 'true');
        }
        setShowOnboarding(false);
    };

    const handleCreateGroup = (newGroupData) => {
        setGroups(prevGroups => {
            const newId = prevGroups.length > 0 ? Math.max(...prevGroups.map(g => g.id)) + 1 : 1;
            // Add current user as the first member and filter out duplicates
            const otherMembers = newGroupData.members.filter(m => m.name.trim().toLowerCase() !== user.name.trim().toLowerCase());
            const membersWithUser = [{ id: user.id, name: user.name }, ...otherMembers]
            const newGroup = { ...newGroupData, id: newId, expenses: [], currency: '₺', members: membersWithUser };
            return [...prevGroups, newGroup];
        });
        setSuccessMessage('Grup başarıyla oluşturuldu!');
        handleNavigate('dashboard');
    };

    const handleAddExpense = (groupId, newExpense) => {
        setGroups(prevGroups => prevGroups.map(group => {
            if (group.id === groupId) {
                const newId = group.expenses.length > 0 ? Math.max(...group.expenses.map(e => e.id)) + 1 : 1;
                return { ...group, expenses: [...group.expenses, { ...newExpense, id: newId, date: new Date().toISOString() }] };
            }
            return group;
        }));
        setSuccessMessage('Harcama başarıyla eklendi!');
    };

    const selectedGroup = useMemo(() =>
        groups.find(g => g.id === selectedGroupId),
        [groups, selectedGroupId]
    );

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <div style={{ fontSize: '24px', marginBottom: '16px' }}>Yükleniyor...</div>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <LandingPage onShowAuth={(view) => setAuthModal({ isOpen: true, view })} />
                {authModal.isOpen && <AuthModal view={authModal.view} onLogin={handleLogin} onSignup={handleSignup} onGoogleLogin={handleGoogleLogin} onClose={() => setAuthModal({ isOpen: false, view: 'login' })} />}
                <AppFooter />
            </>
        );
    }

    // Handle FAB actions
    const handleFabAction = (actionId) => {
        switch (actionId) {
            case 'advisor':
                // Open AI Financial Advisor
                setShowAIAdvisor(true);
                break;
            case 'scan':
                // Open receipt scanner with Gemini Vision
                setShowReceiptScanner(true);
                break;
            case 'expense':
                // Navigate to first group or create group
                if (groups.length > 0) {
                    handleNavigate('groupDetail', groups[0].id);
                } else {
                    handleNavigate('createGroup');
                }
                break;
            case 'group':
                handleNavigate('createGroup');
                break;
            default:
                break;
        }
    };

    // Handle receipt scan completion
    const handleReceiptScanComplete = (data) => {
        // If we have groups, add to first group; otherwise create a new group
        if (groups.length === 0) {
            setSuccessMessage('⚠️ Önce bir grup oluşturun!');
            setTimeout(() => setSuccessMessage(''), 3000);
            handleNavigate('createGroup');
            return;
        }

        // Add expense to the first group (or we could show a group selector)
        const firstGroup = groups[0];
        const newExpense = {
            id: Date.now().toString(),
            description: data.merchantName || 'Taranmış Fatura',
            amount: data.amount || 0,
            paidBy: user.id,
            date: data.date || new Date().toISOString(),
            category: data.category || 'other',
            splitType: 'equal',
            splits: firstGroup.members.map(memberId => ({
                userId: memberId,
                amount: (data.amount || 0) / firstGroup.members.length
            }))
        };

        handleAddExpense(firstGroup.id, newExpense);
        setSuccessMessage(`✅ Fatura tarandı! ${formatCurrency(data.amount)} harcama eklendi.`);
        setTimeout(() => setSuccessMessage(''), 4000);
        handleNavigate('groupDetail', firstGroup.id);
    };

    const renderContent = () => {
        if (!selectedGroup && (currentView === 'groupDetail' || currentView === 'settlement')) {
            handleNavigate('dashboard');
            return null;
        }
        switch (currentView) {
            case 'createGroup':
                return <CreateGroupScreen onCreateGroup={handleCreateGroup} onNavigate={handleNavigate} />;
            case 'groupDetail':
                return <GroupDetail group={selectedGroup} onNavigate={handleNavigate} onAddExpense={handleAddExpense} currentUser={user} />;
            case 'settlement':
                return <SettlementScreen group={selectedGroup} onNavigate={handleNavigate} />;
            case 'analytics':
                return <AnalyticsScreen groups={groups} currentUser={user} onNavigate={handleNavigate} setShowAIAdvisor={setShowAIAdvisor} />;
            case 'settings':
                return <HelpFeedbackModal user={user} onUpdateUser={handleUpdateUser} onClose={() => handleNavigate('dashboard')} onResetData={handleResetData} onLogout={handleLogout} />;
            case 'dashboard':
            default:
                return groups.length > 0
                    ? <GroupsList groups={groups} onSelectGroup={(id) => handleNavigate('groupDetail', id)} />
                    : <WelcomeScreen onCreateGroup={() => handleNavigate('createGroup')} />;
        }
    };

    return (
        <div className="container">
            {showInstallPrompt && <InstallPwaPrompt onInstall={handleInstallClick} onDismiss={() => setShowInstallPrompt(false)} isIOS={isIOS} hasInstallEvent={!!installPromptEvent} />}
            {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
            {showHelpFeedbackModal && <HelpFeedbackModal user={user} onUpdateUser={handleUpdateUser} onClose={() => setShowHelpFeedbackModal(false)} onResetData={handleResetData} onLogout={handleLogout} />}

            <header className="app-header">
                <div className="logo" onClick={() => handleNavigate('dashboard')}>
                    <div className="hexagon"></div>
                    <h1>Payça</h1>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 600 }}>Merhaba, {user.name.split(' ')[0]}</span>
                    <button className="cta-button" onClick={() => handleNavigate('createGroup')}>Yeni Grup</button>
                    <button className="secondary-button" onClick={() => setShowAIAdvisor(true)} title="AI Finansal Danışman">🤖 AI Danışman</button>
                    <button className="secondary-button" onClick={() => handleNavigate('analytics')}>İstatistikler</button>
                    <button className="secondary-button" onClick={() => setShowHelpFeedbackModal(true)}>Yardım</button>
                    <button className="theme-toggle-button" onClick={handleThemeToggle} title="Temayı Değiştir">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button className="secondary-button" onClick={handleLogout} style={{ background: 'var(--danger-color)', color: 'white' }}>Çıkış Yap</button>
                </div>
            </header>
            {successMessage && <div className={`success-toast ${successMessage ? 'show' : ''}`}>{successMessage}</div>}
            <main>{renderContent()}</main>

            {/* Mobile: Bottom Navigation */}
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onNavigate={handleNavigate}
            />

            {/* Mobile: Floating Action Button */}
            <FloatingActionButton
                expanded={fabExpanded}
                onToggle={() => setFabExpanded(!fabExpanded)}
                onAction={handleFabAction}
            />

            {/* Receipt Scanner Modal */}
            {showReceiptScanner && (
                <ReceiptScanner
                    onClose={() => setShowReceiptScanner(false)}
                    onScanComplete={handleReceiptScanComplete}
                />
            )}

            {/* AI Financial Advisor Modal */}
            {showAIAdvisor && (
                <AIAdvisor
                    groups={groups}
                    userId={user.id}
                    onClose={() => setShowAIAdvisor(false)}
                />
            )}

            <AppFooter />
        </div>
    );
}

function LandingPage({ onShowAuth }) {
    return (
        <div className="welcome-container">
            <div className="welcome-card" style={{ padding: '60px' }}>
                <div className="logo" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                    <div className="hexagon"></div>
                    <h1>Payça</h1>
                </div>
                <h2>Masrafları Kolayca Paylaşın</h2>
                <p className="subtitle">Arkadaş grupları, ev arkadaşları ve tatiller için harcamaları takip etmenin en basit yolu.</p>
                <div className="landing-actions">
                    <button className="cta-button" onClick={() => onShowAuth('register')} style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
                        📧 Gmail ile Kayıt Ol
                    </button>
                    <button className="secondary-button" onClick={() => onShowAuth('login')}>
                        Zaten Hesabım Var
                    </button>
                </div>
                 <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                    Tüm verileriniz tarayıcınızda yerel olarak saklanır.
                 </div>
            </div>
        </div>
    );
}

function AuthModal({ view, onLogin, onSignup, onGoogleLogin, onClose }) {
    const [currentView, setCurrentView] = useState(view);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', terms: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleGmailAuth = async () => {
        setLoading(true);
        setError('');
        const { error } = await onGoogleLogin();
        setLoading(false);
        if (error) {
            setError('Google ile giriş başarısız oldu. Lütfen tekrar deneyin.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (currentView === 'register') {
            if (!formData.name || !formData.email || !formData.password) {
                setError("Lütfen tüm zorunlu alanları doldurun.");
                setLoading(false);
                return;
            }
            if (formData.password.length < 6) {
                setError("Şifreniz en az 6 karakter olmalıdır.");
                setLoading(false);
                return;
            }
            if (!formData.terms) {
                setError("Kullanım koşullarını kabul etmelisiniz.");
                setLoading(false);
                return;
            }
            // Real Supabase signup
            const { error } = await onSignup(formData.email, formData.password, formData.name);
            setLoading(false);
            if (error) {
                setError(error.message || "Kayıt başarısız oldu. Lütfen tekrar deneyin.");
            }
        } else { // Login
            if (!formData.email || !formData.password) {
                setError("Lütfen email ve şifrenizi girin.");
                setLoading(false);
                return;
            }
            // Real Supabase login
            const { error } = await onLogin(formData.email, formData.password);
            setLoading(false);
            if (error) {
                setError("Geçersiz e-posta veya şifre.");
            }
        }
    };

    return (
         <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <h2>{currentView === 'register' ? 'Hesap Oluştur' : 'Giriş Yap'}</h2>

                <button className="gmail-button" onClick={handleGmailAuth}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.20455C17.64 8.56682 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5618V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/><path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5618C11.2418 14.1018 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/><path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29H0.957275V9.62182C0.347727 7.545 0.347727 5.31818 0.957275 3.24L3.96409 5.57182C4.67182 3.44455 6.65591 1.86136 9 1.86136C10.3214 1.86136 11.5077 2.33864 12.4405 3.20455L15.0218 0.623182C13.4632 -0.209545 11.4259 -0.636364 9 -0.636364C5.48182 -0.636364 2.43818 1.38136 0.957275 4.32273C-0.319091 6.99545 -0.319091 11.0045 0.957275 13.6773L3.96409 10.71Z" fill="#FBBC05"/><path d="M9 3.57955C10.7182 3.57955 12.0273 4.22727 12.6886 4.85227L15.0805 2.46C13.4632 0.927273 11.43 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/></svg>
                    {currentView === 'register' ? 'Gmail ile Kayıt Ol' : 'Gmail ile Giriş Yap'}
                </button>
                <div className="auth-separator">veya</div>

                <form onSubmit={handleSubmit}>
                    {currentView === 'register' && (
                        <div className="form-group">
                            <label htmlFor="name">Ad Soyad</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">E-posta</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                     {currentView === 'register' && (
                        <>
                         <div className="form-group">
                            <label htmlFor="phone">Telefon (Opsiyonel)</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} />
                         </div>
                         <div className="form-group checkbox">
                            <input type="checkbox" name="terms" id="terms" checked={formData.terms} onChange={handleInputChange} />
                            <label htmlFor="terms">Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.</label>
                         </div>
                        </>
                    )}
                    {error && <p style={{color: 'var(--danger-color)', textAlign: 'center'}}>{error}</p>}
                    <button type="submit" className="form-button" style={{width: '100%'}} disabled={loading}>
                        {loading ? 'Yükleniyor...' : (currentView === 'register' ? 'Hesap Oluştur' : 'Giriş Yap')}
                    </button>
                </form>

                <div className="auth-switch-text">
                    {currentView === 'register'
                        ? <>Zaten hesabın var mı? <button onClick={() => setCurrentView('login')}>Giriş Yap</button></>
                        : <>Hesabın yok mu? <button onClick={() => setCurrentView('register')}>Kayıt Ol</button></>
                    }
                </div>
                 {currentView === 'login' && <a href="#" onClick={(e) => { e.preventDefault(); alert("Şifre sıfırlama maili gönderildi (simülasyon).") }} style={{textAlign:'center', display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px'}}>Şifremi Unuttum</a>}
            </div>
        </div>
    );
}

function CreateGroupScreen({ onCreateGroup, onNavigate }) {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([{ id: 1, name: '' }, { id: 2, name: '' }]);
    const [nextMemberId, setNextMemberId] = useState(3);

    const handleMemberNameChange = (id, newName) => {
        setMembers(members.map(m => m.id === id ? { ...m, name: newName } : m));
    };

    const handleAddMember = () => {
        setMembers([...members, { id: nextMemberId, name: '' }]);
        setNextMemberId(prevId => prevId + 1);
    };

    const handleRemoveMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validMembers = members
            .filter(m => m.name.trim() !== '')
            .map((m, index) => ({ name: m.name.trim(), id: Date.now() + index }));

        if (groupName.trim() && validMembers.length >= 1) {
            onCreateGroup({
                name: groupName,
                description,
                members: validMembers,
                type: 'Genel',
            });
        } else {
            alert("Lütfen grup adını ve en az 1 üye ismini girin.");
        }
    };

    const isFormValid = groupName.trim() !== '' && members.some(m => m.name.trim() !== '');

    return (
        <div>
            <div className="detail-header">
                <h2>Yeni Grup Oluştur</h2>
                <button onClick={() => onNavigate('dashboard')} className="back-button">‹ İptal</button>
            </div>
            <div className="detail-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="groupName">Grup Adı</label>
                        <input id="groupName" type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Örn: Ev Arkadaşları" required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="description">Açıklama (Opsiyonel)</label>
                        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kira, faturalar vb." />
                    </div>
                    <div className="form-group">
                        <label>Üyeler (Kendiniz otomatik olarak ekleneceksiniz)</label>
                        {members.map((member, index) => (
                            <div key={member.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => handleMemberNameChange(member.id, e.target.value)}
                                    placeholder={`Arkadaşının Adı ${index + 1}`}
                                />
                                {members.length > 1 && <button type="button" onClick={() => handleRemoveMember(member.id)} style={{ background: 'var(--danger-color)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', padding: '0 12px', height: '38px', flexShrink: 0 }}>X</button>}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddMember} style={{ width: '100%', padding: '10px', background: 'var(--surface-color-light)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', marginTop: '8px' }}>+ Üye Ekle</button>
                    </div>
                    <button type="submit" className="form-button" disabled={!isFormValid}>Grubu Oluştur</button>
                </form>
            </div>
        </div>
    );
}

function WelcomeScreen({ onCreateGroup }) {
    return (
         <div className="welcome-container">
            <div className="welcome-card">
                <h2>İlk Grubunu Oluştur</h2>
                <p className="subtitle">Başlamak için yeni bir grup oluşturarak masraflarını takip et.</p>
                <button className="cta-button" onClick={onCreateGroup}>Grup Oluştur</button>
            </div>
         </div>
    );
}

function GroupsList({ groups, onSelectGroup }) {
    const groupIcons = { 'Ev Arkadaşları': '🏠', 'Tatil Grubu': '✈️', 'Etkinlik': '🎉', 'Genel': '📝' };
    return (
        <div className="groups-grid">
            {groups.map(group => (
                <div key={group.id} className="group-card" onClick={() => onSelectGroup(group.id)}>
                    <div>
                        <div className="group-card-header">
                            <span className="group-card-icon">{groupIcons[group.type] || '📝'}</span>
                            <h3>{group.name}</h3>
                        </div>
                        <p>{group.description || 'Grup açıklaması yok.'}</p>
                    </div>
                    <div className="group-card-footer">
                        <span>{group.members.length} üye</span>
                        <span className="group-card-details-btn">Grup Detayı</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CameraScanner({ onScanComplete, onCancel }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCapture = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const randomReceipt = sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)];
            const scannedData = {
                description: `${randomReceipt.merchant} Alışverişi`,
                amount: randomReceipt.total.toString(),
            };
            onScanComplete(scannedData);
        }, 1500); // Simulate OCR processing time
    };

    return (
        <div className="scanner-overlay">
            {isProcessing ? (
                <div className="scanner-processing">
                    <div className="spinner"></div>
                    <p>Fiş Taranıyor...</p>
                </div>
            ) : (
                <>
                    <div className="viewfinder">
                        <p>Fişi bu alana ortalayın</p>
                    </div>
                    <div className="scanner-controls">
                        <button className="cta-button" onClick={onCancel} style={{ background: 'var(--surface-color-light)' }}>İptal</button>
                        <button className="capture-button" onClick={handleCapture}></button>
                    </div>
                </>
            )}
        </div>
    );
}

function GroupDetail({ group, onNavigate, onAddExpense, currentUser }) {
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: currentUser.id || '', splitType: 'equal', splits: [] });
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);

    useEffect(() => {
        // Reset form when group changes, default paidBy to current user
        setNewExpense({
            description: '',
            amount: '',
            paidBy: currentUser.id || '',
            splitType: 'equal',
            splits: []
        });
    }, [group, currentUser.id]);

    const handleOcrResult = (scannedData) => {
        setNewExpense(prev => ({ ...prev, ...scannedData }));
        setIsScanning(false);
    };

    const totalExpenses = useMemo(() =>
        group.expenses.reduce((sum, expense) => sum + expense.amount, 0),
        [group.expenses]
    );

    const balances = useMemo(() => {
        // FIX: Add type annotation to `memberBalances` to ensure correct type inference for `balances`.
        const memberBalances: { [key: string]: { id: number; name: string; balance: number } } = {};
        group.members.forEach(member => {
            memberBalances[member.id] = { id: member.id, name: member.name, balance: 0 };
        });

        if (group.members.length === 0) return [];

        group.expenses.forEach(expense => {
            if (memberBalances[expense.paidBy]) {
                memberBalances[expense.paidBy].balance += expense.amount;
            }

            if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
                expense.splits.forEach(split => {
                    if (memberBalances[split.memberId]) {
                        memberBalances[split.memberId].balance -= (split.amount || 0);
                    }
                });
            } else { // Equal split
                const sharePerMember = expense.amount / group.members.length;
                group.members.forEach(member => {
                    memberBalances[member.id].balance -= sharePerMember;
                });
            }
        });

        return Object.values(memberBalances);
    }, [group.expenses, group.members]);

    const settlementSuggestions = useMemo(() => {
        const settlements = calculateSettlements(balances);
        return settlements.map(s => `${s.from.name}, ${s.to.name}'e ${formatCurrency(s.amount)} ödeyebilir.`);
    }, [balances]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'splitType') {
            const newSplits = value === 'unequal'
                ? group.members.map(m => ({ memberId: m.id, amount: '' }))
                : [];
            setNewExpense(prev => ({ ...prev, [name]: value, splits: newSplits }));
        } else {
            setNewExpense(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCustomSplitChange = (memberId, value) => {
        setNewExpense(prev => {
            const newSplits = prev.splits.map(s =>
                s.memberId === memberId ? { ...s, amount: value } : s
            );
            return { ...prev, splits: newSplits };
        });
    };

    const handleShareGroup = () => {
        const groupLink = `${window.location.origin}/#/group/${group.id}`;
        const shareText = `Payça grubuna katıl: "${group.name}"\n\n${group.description || 'Harcamalarımızı birlikte takip edelim!'}\n\n${groupLink}`;

        // Try native share API first (mobile)
        if (navigator.share) {
            navigator.share({
                title: `Payça - ${group.name}`,
                text: shareText,
                url: groupLink
            }).catch(err => console.log('Share cancelled'));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Grup linki kopyalandı! Arkadaşlarınla paylaşabilirsin.');
            });
        }
    };

    const handleShareWhatsApp = () => {
        const groupLink = `${window.location.origin}/#/group/${group.id}`;
        const shareText = `*Payça Grubuna Katıl!* 🎉\n\n📊 Grup: *${group.name}*\n${group.description ? `📝 ${group.description}\n` : ''}\n👥 ${group.members.length} üye\n\n🔗 Katılmak için tıkla:\n${groupLink}`;
        const encodedMessage = encodeURIComponent(shareText);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    const handleCopyLink = () => {
        const groupLink = `${window.location.origin}/#/group/${group.id}`;
        navigator.clipboard.writeText(groupLink).then(() => {
            alert('✅ Grup linki kopyalandı!');
        }).catch(() => {
            alert('Link kopyalanamadı. Lütfen manuel olarak kopyalayın: ' + groupLink);
        });
    };

    const handleShareSummary = () => {
        let summary = `*Payça Grup Özeti: ${group.name}*\n\n`;
        summary += `Toplam Harcama: *${formatCurrency(totalExpenses)}*\n\n`;
        summary += "*Güncel Bakiye Durumu:*\n";
        balances.forEach(b => {
            const balanceText = b.balance >= 0 ? `(Alacaklı: ${formatCurrency(b.balance)})` : `(Borçlu: ${formatCurrency(b.balance)})`;
            summary += `- ${b.name}: ${balanceText}\n`;
        });

        const encodedMessage = encodeURIComponent(summary);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    const customSplitTotal = useMemo(() => {
        if (newExpense.splitType !== 'unequal') return 0;
        return newExpense.splits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
    }, [newExpense.splits, newExpense.splitType]);

    const remainingToSplit = useMemo(() => {
        const totalAmount = parseFloat(newExpense.amount) || 0;
        return totalAmount - customSplitTotal;
    }, [newExpense.amount, customSplitTotal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(newExpense.amount);
        if (!newExpense.description || !amount || amount <= 0 || !newExpense.paidBy) {
            setError('Lütfen tüm alanları doğru doldurun.');
            return;
        }
         if (newExpense.splitType === 'unequal' && Math.abs(remainingToSplit) > 0.01) {
            setError('Kişiye özel tutarların toplamı, harcama tutarına eşit olmalıdır.');
            return;
        }
        const expenseToAdd = {
            description: newExpense.description,
            amount: amount,
            paidBy: parseInt(newExpense.paidBy),
            splitType: newExpense.splitType,
            splits: newExpense.splitType === 'unequal'
                ? newExpense.splits.map(s => ({...s, amount: parseFloat(s.amount) || 0}))
                : []
        };

        onAddExpense(group.id, expenseToAdd);
        setNewExpense({ description: '', amount: '', paidBy: currentUser.id, splitType: 'equal', splits: [] });
        setError('');
    };

    const isFormInvalid = !newExpense.description ||
        !newExpense.amount ||
        parseFloat(newExpense.amount) <= 0 ||
        !newExpense.paidBy ||
        (newExpense.splitType === 'unequal' && Math.abs(remainingToSplit) > 0.01);

    if (isScanning) {
        return <CameraScanner onScanComplete={handleOcrResult} onCancel={() => setIsScanning(false)} />;
    }

    return (
        <div>
            <div className="detail-header">
                <button onClick={() => onNavigate('dashboard')} className="back-button">‹ Geri</button>
                <h2>{group.name}</h2>
                <div className="share-actions-container">
                    <div className="export-button">
                        👥 Davet Et
                        <div className="export-options">
                            <button onClick={handleShareWhatsApp}>📱 WhatsApp ile Paylaş</button>
                            <button onClick={() => setShowQRCode(true)}>📱 QR Kod Göster</button>
                            <button onClick={handleCopyLink}>🔗 Linki Kopyala</button>
                            <button onClick={handleShareGroup}>📤 Paylaş...</button>
                        </div>
                    </div>
                    <button className="share-button" onClick={handleShareSummary}>Özet Paylaş</button>
                    <div className="export-button">
                        Dışa Aktar
                        <div className="export-options">
                            <button onClick={() => alert('Grup özeti Excel\'e aktarıldı (simülasyon).')}>Excel'e Aktar (.xlsx)</button>
                            <button onClick={() => alert('Grup özeti PDF olarak kaydedildi (simülasyon).')}>PDF Olarak Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="total-expense">
                <h3>Toplam Harcama</h3>
                <p>{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="detail-grid">
                <div className="detail-card">
                    <h3>Harcama Ekle</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="label-container">
                                <label htmlFor="description">Ne için?</label>
                                <button type="button" className="icon-button" title="Fiş Tara" onClick={() => setIsScanning(true)}>📸</button>
                            </div>
                            <input type="text" id="description" name="description" placeholder="Market alışverişi" value={newExpense.description} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Tutar</label>
                            <input type="number" id="amount" name="amount" placeholder="0,00" value={newExpense.amount} onChange={handleInputChange} step="0.01" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paidBy">Kim ödedi?</label>
                            <select id="paidBy" name="paidBy" value={newExpense.paidBy} onChange={handleInputChange}>
                                {group.members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Paylaşım Türü</label>
                            <select name="splitType" value={newExpense.splitType} onChange={handleInputChange}>
                                <option value="equal">Eşit Paylaş</option>
                                <option value="unequal">Eşit Olmayan Paylaşım</option>
                            </select>
                        </div>

                        {newExpense.splitType === 'unequal' && (
                            <div className="form-group custom-splits">
                                <label>Kişiye Özel Tutarlar</label>
                                {group.members.map(member => {
                                    const split = newExpense.splits.find(s => s.memberId === member.id) || { amount: '' };
                                    return (
                                        <div key={member.id} className="custom-split-item">
                                            <span>{member.name}</span>
                                            <input
                                                type="number"
                                                value={split.amount}
                                                onChange={(e) => handleCustomSplitChange(member.id, e.target.value)}
                                                placeholder="0,00"
                                                step="0.01"
                                            />
                                        </div>
                                    )
                                })}
                                <div className={`split-summary ${Math.abs(remainingToSplit) < 0.01 ? 'balanced' : 'unbalanced'}`}>
                                    {Math.abs(remainingToSplit) < 0.01 ? 'Toplamlar Eşit' : `Kalan: ${formatCurrency(remainingToSplit)}`}
                                </div>
                            </div>
                        )}

                        {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
                        <button type="submit" className="form-button" disabled={isFormInvalid}>Harcama Ekle</button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="detail-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3>Kim Kime Borçlu?</h3>
                            {settlementSuggestions.length > 0 &&
                                <button className="cta-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => onNavigate('settlement', group.id)}>
                                    Hesaplaş
                                </button>
                            }
                        </div>
                         <ul className="balance-list">
                            {balances.map(b => (
                                <li key={b.name} className="balance-item">
                                    <span>{b.name}</span>
                                    <span className={b.balance >= 0 ? 'positive-balance' : 'negative-balance'}>
                                        {formatCurrency(b.balance)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {settlementSuggestions.length > 0 && (
                            <div className="settlement-suggestions">
                                <h4>Ödeme Önerileri</h4>
                                {settlementSuggestions.map((s, i) => <p key={i}>{s}</p>)}
                            </div>
                        )}
                    </div>
                    <div className="detail-card">
                        <h3>Grup Üyeleri</h3>
                        <ul className="member-list">
                            {group.members.map(member => (
                                <li key={member.id} className="member-list-item">
                                    {member.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="detail-card" style={{ gridColumn: '1 / -1' }}>
                     <h3>Son Harcamalar</h3>
                     {group.expenses.length === 0 ? <p>Henüz harcama yok.</p> : (
                        <ul className="expense-list">
                            {group.expenses.slice().reverse().map(expense => (
                                <li key={expense.id} className="expense-item">
                                    <div className="expense-info">
                                        <p>{expense.description}</p>
                                        <p className="date">
                                            {group.members.find(m => m.id === expense.paidBy)?.name} ödedi - {formatDate(expense.date)}
                                        </p>
                                    </div>
                                    <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                                </li>
                            ))}
                        </ul>
                     )}
                </div>
            </div>
            {showQRCode && (
                <QRCodeModal
                    groupId={group.id}
                    groupName={group.name}
                    onClose={() => setShowQRCode(false)}
                />
            )}
        </div>
    );
}

function SettlementScreen({ group, onNavigate }) {
    const balances = useMemo(() => {
        // FIX: Add type annotation to `memberBalances` to ensure correct type inference for `balances`.
        const memberBalances: { [key: string]: { id: number; name: string; balance: number } } = {};
        group.members.forEach(member => {
            memberBalances[member.id] = { id: member.id, name: member.name, balance: 0 };
        });
        if (group.members.length === 0) return [];
        group.expenses.forEach(expense => {
            if (memberBalances[expense.paidBy]) {
                memberBalances[expense.paidBy].balance += expense.amount;
            }
            if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
                expense.splits.forEach(split => {
                    if (memberBalances[split.memberId]) {
                        memberBalances[split.memberId].balance -= (split.amount || 0);
                    }
                });
            } else {
                const sharePerMember = expense.amount / group.members.length;
                group.members.forEach(member => {
                    memberBalances[member.id].balance -= sharePerMember;
                });
            }
        });
        return Object.values(memberBalances);
    }, [group.expenses, group.members]);

    const settlements = useMemo(() => calculateSettlements(balances), [balances]);

    const [completedPayments, setCompletedPayments] = useState(() => Array(settlements.length).fill(false));

    const handleMarkAsPaid = (index) => {
        setCompletedPayments(prev => {
            const newCompleted = [...prev];
            newCompleted[index] = !newCompleted[index];
            return newCompleted;
        });
    };

    const handleWhatsAppReminder = (debtorName, creditorName, amount) => {
        const message = `Selam ${debtorName}! Payça'daki "${group.name}" grubundan ${creditorName}'e olan ${formatCurrency(amount)} borcunu hatırlatmak istedim. Ödemeyi yapınca haber verir misin? Teşekkürler!`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    return (
        <div>
            <div className="detail-header">
                <h2>Hesaplaşma: {group.name}</h2>
                <button onClick={() => onNavigate('groupDetail', group.id)} className="back-button">‹ Gruba Dön</button>
            </div>
            <div className="settlement-list">
                {settlements.length === 0 ?
                    <div className="detail-card" style={{ textAlign: 'center' }}>Tüm hesaplar eşit, ödenecek borç bulunmuyor.</div> :
                    settlements.map((s, index) => (
                        <div className={`settlement-card ${completedPayments[index] ? 'completed' : ''}`} key={index}>
                            <div className="settlement-card-header">
                                <div className="settlement-info">
                                    <span className="from">{s.from.name}</span>
                                    <span style={{ margin: '0 8px' }}>→</span>
                                    <span className="to">{s.to.name}</span>
                                    <span style={{ marginLeft: '16px', color: 'var(--text-primary)' }}>{formatCurrency(s.amount)}</span>
                                </div>
                                <button
                                    className={`action-button ${completedPayments[index] ? 'unpaid' : 'paid'}`}
                                    onClick={() => handleMarkAsPaid(index)}
                                >
                                    {completedPayments[index] ? 'Geri Al' : 'Ödendi'}
                                </button>
                            </div>
                            {!completedPayments[index] &&
                                <div className="settlement-actions">
                                    <button
                                        className="action-button whatsapp"
                                        onClick={() => handleWhatsAppReminder(s.from.name, s.to.name, s.amount)}
                                    >
                                        WhatsApp ile Hatırlat
                                    </button>
                                    <div className="action-button other">
                                        Diğer Yöntemler
                                        <div className="payment-options">
                                            <button onClick={() => alert('Papara ile ödeme simülasyonu.')}>Papara ile Öde</button>
                                            <button onClick={() => alert('Banka transferi için QR kod oluşturuldu.')}>QR Kod Oluştur</button>
                                            <button onClick={() => alert('IBAN bilgisi paylaşıldı.')}>IBAN Paylaş</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

function AnalyticsScreen({ groups, currentUser, onNavigate, setShowAIAdvisor }) {
    const [budget, setBudget] = useState(2000);

    // FIX: Correctly calculate the user's personal *share* of each expense for accurate analytics.
    const userShares = useMemo(() => {
        const allShares: any[] = [];
        groups.forEach(group => {
            group.expenses.forEach(expense => {
                const memberCount = group.members.length;
                if (memberCount === 0) return;

                let userShareAmount = 0;

                if (expense.splitType === 'unequal' && expense.splits?.length > 0) {
                    const userSplit = expense.splits.find(s => s.memberId === currentUser.id);
                    if (userSplit) {
                        userShareAmount = userSplit.amount || 0;
                    }
                } else { // Equal split by default
                    userShareAmount = expense.amount / memberCount;
                }

                if (userShareAmount > 0) {
                    allShares.push({
                        id: `${group.id}-${expense.id}`,
                        description: expense.description,
                        date: expense.date,
                        amount: userShareAmount, // This is the user's actual share
                        groupName: group.name,
                    });
                }
            });
        });
        return allShares;
    }, [groups, currentUser.id]);


    const monthlySpending = useMemo(() => {
        const data = Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return { month: d.toLocaleString('tr-TR', { month: 'short' }), total: 0 };
        }).reverse();

        userShares.forEach(share => {
            const expenseDate = new Date(share.date);
            const monthKey = expenseDate.toLocaleString('tr-TR', { month: 'short' });
            const monthData = data.find(d => d.month === monthKey);
            if (monthData) {
                monthData.total += share.amount;
            }
        });

        return data;
    }, [userShares]);

    const currentMonthSpending = monthlySpending[monthlySpending.length - 1]?.total || 0;
    const prevMonthSpending = monthlySpending[monthlySpending.length - 2]?.total || 0;
    const monthComparison = prevMonthSpending > 0
        ? ((currentMonthSpending - prevMonthSpending) / prevMonthSpending) * 100
        : (currentMonthSpending > 0 ? 100 : 0);

    const getCategoryFromDescription = useCallback((desc) => {
        const lowerDesc = desc.toLowerCase();
        if (lowerDesc.includes('market') || lowerDesc.includes('migros') || lowerDesc.includes('a101') || lowerDesc.includes('yemek')) return 'Yemek';
        if (lowerDesc.includes('fatura')) return 'Faturalar';
        if (lowerDesc.includes('taksi') || lowerDesc.includes('ulaşım')) return 'Ulaşım';
        if (lowerDesc.includes('sinema') || lowerDesc.includes('eğlence')) return 'Eğlence';
        return 'Diğer';
    }, []);

    const categorySpending = useMemo(() => {
        const spending: { [key: string]: number } = {};
        userShares.forEach(share => {
            const category = getCategoryFromDescription(share.description);
            if (!spending[category]) {
                spending[category] = 0;
            }
            spending[category] += share.amount;
        });
        return Object.entries(spending)
            .map(([name, total]) => ({ name, total: total as number }))
            .sort((a, b) => b.total - a.total);
    }, [userShares, getCategoryFromDescription]);

    const pieChartData = useMemo(() => {
        const total = categorySpending.reduce((sum, cat) => sum + cat.total, 0);
        if (total === 0) return { gradient: '', legend: [] };

        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];
        let cumulativePercent = 0;
        const gradientParts = [];
        const legend = [];

        categorySpending.slice(0, 5).forEach((cat, i) => {
            const percent = (cat.total / total) * 100;
            const color = colors[i % colors.length];
            gradientParts.push(`${color} ${cumulativePercent}% ${cumulativePercent + percent}%`);
            legend.push({ name: cat.name, color, total: cat.total });
            cumulativePercent += percent;
        });

        return {
            gradient: `conic-gradient(${gradientParts.join(', ')})`,
            legend
        };
    }, [categorySpending]);

    const budgetUsage = budget > 0 ? (currentMonthSpending / budget) * 100 : 0;
    
    const groupOne = groups.length > 0 ? groups[0] : null;
    const groupOneAverage = groupOne && groupOne.members.length > 0
        ? groupOne.expenses.reduce((s, e) => s + e.amount, 0) / groupOne.members.length
        : 0;

    return (
        <div>
            <div className="detail-header">
                <h2>İstatistikler ({currentUser.name})</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button onClick={() => setShowAIAdvisor(true)} className="cta-button" style={{ fontSize: '0.9rem' }}>
                        🤖 AI Danışman
                    </button>
                    <button onClick={() => onNavigate('dashboard')} className="back-button">‹ Geri</button>
                </div>
            </div>
            <div className="analytics-grid">
                <div className="detail-card stat-card">
                     <h3>Aylık Harcama Dağılımı</h3>
                     <div className="chart-container">
                        <div className="bar-chart">
                            {monthlySpending.map(data => {
                                const maxVal = Math.max(...monthlySpending.map(m => m.total), 1);
                                const height = (data.total / maxVal) * 100;
                                return (
                                    <div key={data.month} className="bar" style={{ height: `${height}%` }} title={`${data.month}: ${formatCurrency(data.total)}`}>
                                       <div className="bar-label">{data.month}</div>
                                    </div>
                                )
                            })}
                        </div>
                     </div>
                     <div className="stat-summary">
                        <p>Bu ay toplam harcaman:</p>
                        <p className="stat-value">{formatCurrency(currentMonthSpending)}</p>
                        <p className={`stat-comparison ${monthComparison >= 0 ? 'negative-balance' : 'positive-balance'}`}>
                            Geçen aya göre %{Math.abs(monthComparison).toFixed(0)} {monthComparison >= 0 ? 'daha fazla' : 'daha az'}
                        </p>
                     </div>
                </div>
                 <div className="detail-card stat-card">
                    <h3>Kategori Analizi</h3>
                    <div className="pie-chart-container">
                        <div className="pie-chart" style={{ background: pieChartData.gradient }}></div>
                        <div className="pie-legend">
                            <ul>
                                {pieChartData.legend.map(item => (
                                    <li key={item.name}>
                                        <div className="legend-color-box" style={{ backgroundColor: item.color }}></div>
                                        <span>{item.name}: {formatCurrency(item.total)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="insight-text">
                        En çok harcadığın kategori: <strong>{categorySpending[0]?.name || 'Yok'}</strong>
                    </div>
                </div>
                <div className="detail-card stat-card budget-tracker">
                    <h3>Aylık Bütçe Takibi</h3>
                    <div className="form-group">
                        <label htmlFor="budget">Bütçeni Belirle (Aylık)</label>
                        <input type="number" id="budget" value={budget} onChange={(e) => setBudget(parseFloat(e.target.value) || 0)} />
                    </div>
                     <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${Math.min(budgetUsage, 100)}%`,
                                backgroundColor: budgetUsage > 80 ? 'var(--danger-color)' : (budgetUsage > 60 ? 'var(--warning-color)' : 'var(--success-color)')
                            }}
                        ></div>
                    </div>
                    <p style={{ textAlign: 'right', fontWeight: 600, marginTop: '8px' }}>
                        {formatCurrency(currentMonthSpending)} / {formatCurrency(budget)} (%{budgetUsage.toFixed(0)})
                    </p>
                     {budgetUsage > 80 &&
                        <div className="insight-text" style={{ borderColor: 'var(--danger-color)' }}>
                            Uyarı: Bütçenin %80'inden fazlasını kullandın!
                        </div>
                     }
                </div>
                <div className="detail-card stat-card">
                     <h3>Grup ve Ödeme Alışkanlıkları</h3>
                     <p><strong>{groupOne ? groupOne.name : 'İlk Grup'}</strong> grubunda kişi başı ortalama harcama:</p>
                     <p className="stat-value">{formatCurrency(groupOneAverage)}</p>
                     <p className="stat-comparison positive-balance">Grup harcama verileri karşılaştırması yakında eklenecek.</p>
                </div>
            </div>
        </div>
    );
}

function OnboardingModal({ onComplete }) {
    const [step, setStep] = useState(0);
    const steps = [
        { icon: '👋', title: 'Payça\'ya Hoş Geldin!', text: 'Masraflarını arkadaşlarınla kolayca bölüşmeye başla.' },
        { icon: '👥', title: 'Grup Oluştur', text: 'Ev arkadaşların, tatil grubun veya arkadaşların için bir grup oluştur.' },
        { icon: '💸', title: 'Harcama Ekle', text: 'Yaptığın harcamaları gruba ekle, kimin ödediğini ve nasıl bölüşüleceğini belirt.' },
        { icon: '🤝', title: 'Hesaplaş', text: 'Kim kime ne kadar borçlu anında gör ve kolayca hesaplaş.' }
    ];

    const currentStep = steps[step];

    return (
        <div className="modal-overlay">
            <div className="modal-content onboarding-content">
                <div className="onboarding-icon">{currentStep.icon}</div>
                <h2>{currentStep.title}</h2>
                <p>{currentStep.text}</p>
                <div className="onboarding-dots">
                    {steps.map((_, index) => (
                        <div key={index} className={`onboarding-dot ${index === step ? 'active' : ''}`}></div>
                    ))}
                </div>
                <div className="onboarding-actions">
                    {step > 0 ? (
                        <button className="secondary-button" onClick={() => setStep(s => s - 1)}>Geri</button>
                    ) : <div></div>}
                    {step < steps.length - 1 ? (
                        <button className="cta-button" onClick={() => setStep(s => s + 1)}>İleri</button>
                    ) : (
                        <button className="cta-button" onClick={onComplete}>Başla!</button>
                    )}
                </div>
            </div>
        </div>
    );
}

function HelpFeedbackModal({ user, onUpdateUser, onClose, onResetData, onLogout }) {
    const [activeTab, setActiveTab] = useState('help');
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [profileName, setProfileName] = useState(user.name);

    const handleProfileSave = (e) => {
        e.preventDefault();
        onUpdateUser({ name: profileName });
        onClose();
    };
    
    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        alert('Geri bildiriminiz için teşekkürler!');
        setRating(0);
        setFeedback('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <div className="modal-tabs">
                    <button className={`modal-tab ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>Yardım (SSS)</button>
                    <button className={`modal-tab ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>Geri Bildirim</button>
                    <button className={`modal-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profil & Ayarlar</button>
                </div>
                {activeTab === 'help' && (
                    <div>
                        <h3>Sıkça Sorulan Sorular</h3>
                        <details className="faq-item">
                            <summary>Payça nasıl çalışır?</summary>
                            <p>Bir grup oluşturun, üyeleri ekleyin, harcamaları girin. Payça kimin kime ne kadar borçlu olduğunu otomatik hesaplar.</p>
                        </details>
                        <details className="faq-item">
                            <summary>Verilerim güvende mi?</summary>
                            <p>Evet, tüm verileriniz yalnızca sizin tarayıcınızda, yerel olarak saklanır. Sunucularımızda kişisel harcama verisi tutmuyoruz.</p>
                        </details>
                         <details className="faq-item">
                            <summary>Uygulamayı nasıl yüklerim?</summary>
                            <p>Tarayıcınızın menüsünden "Ana Ekrana Ekle" seçeneğini kullanarak Payça'yı bir uygulama gibi kullanabilirsiniz.</p>
                        </details>
                    </div>
                )}
                {activeTab === 'feedback' && (
                    <div>
                        <h3>Geri Bildirim</h3>
                        <form onSubmit={handleFeedbackSubmit}>
                            <p>Uygulamamızı değerlendirin:</p>
                             <div className="star-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className={`star ${star <= rating ? 'selected' : ''}`} onClick={() => setRating(star)}>★</span>
                                ))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="feedbackText">Görüşleriniz:</label>
                                <textarea id="feedbackText" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Uygulamayı daha iyi hale getirmemize yardımcı olun..."></textarea>
                            </div>
                            <button type="submit" className="form-button">Gönder</button>
                        </form>
                    </div>
                )}
                 {activeTab === 'profile' && (
                    <div>
                        <h3>Profil & Ayarlar</h3>
                        <form onSubmit={handleProfileSave}>
                            <div className="form-group">
                                <label htmlFor="profileName">Ad Soyad</label>
                                <input id="profileName" type="text" value={profileName} onChange={e => setProfileName(e.target.value)} />
                            </div>
                            <button type="submit" className="form-button">Kaydet</button>
                        </form>
                        <div style={{marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px'}}>
                            <h4>Tehlikeli Alan</h4>
                            <button onClick={onResetData} className="form-button" style={{background: 'var(--danger-color)', width: '100%', marginBottom: '12px'}}>Tüm Verileri Sıfırla</button>
                            <button onClick={onLogout} className="secondary-button" style={{width: '100%'}}>Çıkış Yap</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Bottom Navigation Component (Mobile)
function BottomNavigation({ activeTab, onTabChange, onNavigate }) {
    const tabs = [
        { id: 'home', icon: '🏠', label: 'Ana', view: 'dashboard' },
        { id: 'analytics', icon: '📊', label: 'Analiz', view: 'analytics' },
        { id: 'groups', icon: '💰', label: 'Gruplar', view: 'dashboard' },
        { id: 'settings', icon: '⚙️', label: 'Ayarlar', view: 'settings' }
    ];

    const handleTabClick = (tab) => {
        onTabChange(tab.id);
        if (tab.view) {
            onNavigate(tab.view);
        }
    };

    return (
        <nav className="bottom-navigation">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                    aria-label={tab.label}
                >
                    <span className="bottom-nav-icon">{tab.icon}</span>
                    <span className="bottom-nav-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}

// Floating Action Button (FAB) with Extended Menu
function FloatingActionButton({ expanded, onToggle, onAction }) {
    const actions = [
        { id: 'advisor', icon: '🤖', label: 'AI Danışman', color: '#10b981' },
        { id: 'scan', icon: '📷', label: 'Fatura Tara', color: '#8b5cf6' },
        { id: 'expense', icon: '💰', label: 'Harcama Ekle', color: '#6366f1' },
        { id: 'group', icon: '👥', label: 'Grup Oluştur', color: '#ec4899' }
    ];

    const handleAction = (actionId) => {
        onAction(actionId);
        onToggle(); // Close menu after action
    };

    return (
        <div className="fab-container">
            {expanded && (
                <>
                    <div className="fab-backdrop" onClick={onToggle}></div>
                    <div className="fab-menu">
                        {actions.map((action, index) => (
                            <button
                                key={action.id}
                                className="fab-menu-item"
                                onClick={() => handleAction(action.id)}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    backgroundColor: action.color
                                }}
                            >
                                <span className="fab-menu-icon">{action.icon}</span>
                                <span className="fab-menu-label">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
            <button
                className={`fab ${expanded ? 'fab-expanded' : ''}`}
                onClick={onToggle}
                aria-label={expanded ? 'Kapat' : 'Hızlı Menü'}
            >
                <span className="fab-icon">{expanded ? '✕' : '+'}</span>
            </button>
        </div>
    );
}

function AppFooter() {
    return (
        <footer className="app-footer">
            <p>© {new Date().getFullYear()} Payça. Tüm hakları saklıdır.</p>
            <div>
                <a href="#">Gizlilik Politikası</a>
                <a href="#">Kullanım Koşulları</a>
            </div>
        </footer>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <App />
            </AuthProvider>
        </React.StrictMode>
    );
}