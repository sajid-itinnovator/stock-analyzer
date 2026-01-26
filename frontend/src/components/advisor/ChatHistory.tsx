import React from 'react';
import ChatMessage from './ChatMessage';

interface Message {
    sender: 'ai' | 'user';
    text: string;
    timestamp: Date | string;
}

interface ChatHistoryProps {
    messages: Message[];
    isTyping?: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isTyping }) => {
    return (
        <div className="chat-history">
            <div className="chat-date-separator">Research Session</div>
            {messages.map((msg, index) => (
                <ChatMessage
                    key={index}
                    message={msg.text}
                    sender={msg.sender}
                    timestamp={msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.timestamp}
                />
            ))}
            {isTyping && (
                <div className="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            )}
        </div>
    );
};

export default ChatHistory;
