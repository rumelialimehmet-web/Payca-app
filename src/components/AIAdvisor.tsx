import React, { useState } from 'react';
import { getFinancialAdvice } from '../lib/gemini';

interface AIAdvisorProps {
    groups: any[];
    userId: string;
    onClose: () => void;
}

export function AIAdvisor({ groups, userId, onClose }: AIAdvisorProps) {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
        {
            role: 'ai',
            content: '👋 Merhaba! Ben Payça AI Finansal Danışmanınızım. Harcamalarınızı analiz edip size önerilerde bulunabilirim. Size nasıl yardımcı olabilirim?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const quickQuestions = [
        '💰 Bu ay ne kadar harcadım?',
        '📊 Hangi kategoride en çok harcama yaptım?',
        '💡 Nasıl tasarruf edebilirim?',
        '🎯 Bütçe önerisi ver',
        '📈 Harcama trendimi analiz et'
    ];

    const handleSendMessage = async (message?: string) => {
        const messageToSend = message || inputMessage;
        if (!messageToSend.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user' as const, content: messageToSend }];
        setMessages(newMessages);
        setInputMessage('');
        setIsLoading(true);

        // Get AI response
        const result = await getFinancialAdvice(groups, userId);

        setIsLoading(false);

        if (result.success && result.advice) {
            setMessages([...newMessages, { role: 'ai' as const, content: result.advice }]);
        } else {
            setMessages([...newMessages, {
                role: 'ai' as const,
                content: '😔 Üzgünüm, şu an analiz yapamıyorum. Lütfen daha sonra tekrar deneyin. (Hata: ' + result.error + ')'
            }]);
        }
    };

    const handleQuickQuestion = (question: string) => {
        handleSendMessage(question);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content ai-advisor-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ai-advisor-header">
                    <div className="ai-advisor-title">
                        <span className="ai-advisor-icon">🤖</span>
                        <h2>AI Finansal Danışman</h2>
                    </div>
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="ai-advisor-chat">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`ai-message ${message.role === 'user' ? 'user-message' : 'ai-message-bot'}`}
                        >
                            {message.role === 'ai' && (
                                <div className="ai-avatar">🤖</div>
                            )}
                            <div className="ai-message-content">
                                {message.content}
                            </div>
                            {message.role === 'user' && (
                                <div className="user-avatar">👤</div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="ai-message ai-message-bot">
                            <div className="ai-avatar">🤖</div>
                            <div className="ai-message-content ai-typing">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {messages.length === 1 && (
                    <div className="ai-quick-questions">
                        <p className="quick-questions-label">Hızlı Sorular:</p>
                        <div className="quick-questions-grid">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    className="quick-question-btn"
                                    onClick={() => handleQuickQuestion(question)}
                                    disabled={isLoading}
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="ai-advisor-input">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Sorunuzu yazın..."
                        disabled={isLoading}
                        className="ai-input-field"
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !inputMessage.trim()}
                        className="ai-send-button"
                    >
                        {isLoading ? '⏳' : '📤'}
                    </button>
                </div>

                <div className="ai-advisor-footer">
                    <small>💡 Yapay zeka önerileri bilgilendirme amaçlıdır</small>
                </div>
            </div>
        </div>
    );
}
