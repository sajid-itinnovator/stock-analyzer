import React from 'react';

interface ChatMessageProps {
    message: string;
    sender: 'ai' | 'user';
    timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
    const isAI = sender === 'ai';

    return (
        <div className={`chat-message ${sender}-message`}>
            <div className="message-avatar">
                {isAI ? (
                    <div className="ai-avatar">🤖</div>
                ) : (
                    <div className="user-avatar">👤</div>
                )}
            </div>
            <div className="message-content">
                <div className="message-header">
                    <span className="sender-name">{isAI ? 'AI Advisor' : 'User'}</span>
                    <span className="message-time">{timestamp}</span>
                </div>
                <div className="message-body">
                    {(() => {
                        const parts = message.split(/```(\w*)\n?([\s\S]*?)```/g);
                        return parts.map((part, i) => {
                            if (i % 3 === 0) {
                                // Text
                                if (!part.trim()) return null;
                                return <p key={i} className="message-text" style={{ whiteSpace: 'pre-wrap', marginBottom: '0.5em' }}>{part}</p>;
                            }
                            if (i % 3 === 1) return null; // Logic handled in next iteration
                            if (i % 3 === 2) {
                                // Code
                                const lang = parts[i - 1];
                                return (
                                    <div key={i} className="code-block-container" style={{ background: '#1e293b', color: '#f8fafc', padding: '12px', borderRadius: '8px', margin: '8px 0', overflow: 'hidden' }}>
                                        {lang && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 600 }}>{lang}</div>}
                                        <pre style={{ margin: 0, overflowX: 'auto', fontFamily: '"Fira Code", monospace', fontSize: '0.9rem' }}>
                                            <code>{part}</code>
                                        </pre>
                                    </div>
                                );
                            }
                            return null;
                        });
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
