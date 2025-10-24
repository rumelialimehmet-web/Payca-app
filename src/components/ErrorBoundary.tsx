import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console (in production, send to error tracking service like Sentry)
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // TODO: Send error to monitoring service
        // Example: Sentry.captureException(error);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        padding: '20px',
                        textAlign: 'center',
                        background: 'var(--bg-color)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <div
                        style={{
                            maxWidth: '500px',
                            padding: '40px',
                            borderRadius: '12px',
                            background: 'var(--surface-color)',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <h1 style={{ fontSize: '4rem', margin: '0 0 16px 0' }}>😕</h1>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem' }}>
                            Bir Hata Oluştu
                        </h2>
                        <p
                            style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '24px',
                                lineHeight: '1.6'
                            }}
                        >
                            Üzgünüz, beklenmeyen bir sorun oluştu. Lütfen sayfayı yeniden yüklemeyi deneyin.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details
                                style={{
                                    marginBottom: '24px',
                                    padding: '16px',
                                    background: 'var(--surface-color-light)',
                                    borderRadius: '8px',
                                    textAlign: 'left',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <summary style={{ cursor: 'pointer', marginBottom: '8px', fontWeight: 600 }}>
                                    Hata Detayları (Geliştirici Modu)
                                </summary>
                                <pre
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontSize: '0.75rem',
                                        color: 'var(--danger-color)'
                                    }}
                                >
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => window.location.reload()}
                                className="cta-button"
                                style={{ padding: '12px 24px', fontSize: '1rem' }}
                            >
                                Sayfayı Yenile
                            </button>
                            <button
                                onClick={this.handleReset}
                                className="secondary-button"
                                style={{ padding: '12px 24px', fontSize: '1rem' }}
                            >
                                Tekrar Dene
                            </button>
                        </div>

                        <p
                            style={{
                                marginTop: '24px',
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            Sorun devam ederse, lütfen{' '}
                            <a
                                href="mailto:support@payca.app"
                                style={{ color: 'var(--primary-color)' }}
                            >
                                destek ekibiyle
                            </a>{' '}
                            iletişime geçin.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Higher-order component to wrap any component with error boundary
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundaryComponent(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
