import React, { useState, useEffect } from 'react';
import '../styles/analysis.css';
import { useStock } from '../context/StockContext';
import ChatHistory from '../components/advisor/ChatHistory';
import ChatInput from '../components/advisor/ChatInput';
import { chatService, analysisService } from '../services/api';

// Candlestick SVG Chart Component
interface ChartData {
    dates: string[];
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    currency?: string;
}

const CandlestickChart = ({ data }: { data: ChartData }) => {
    if (!data || !data.close || data.close.length === 0) return null;

    // Determine min/max for scaling
    const allValues = [...data.high, ...data.low];
    const minPrice = Math.min(...allValues);
    const maxPrice = Math.max(...allValues);
    const range = maxPrice - minPrice || 1;

    // SVG Dimensions
    const width = 800;
    const height = 300;
    const padding = 40;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    const count = data.close.length;
    // Calculate candle width dynamically
    const candleWidth = Math.max(1, (chartWidth / count) * 0.6);
    const step = chartWidth / (count - 1 || 1);

    const getY = (price: number) => {
        return height - padding - ((price - minPrice) / range) * chartHeight;
    };

    const getCurrencySymbol = (curr?: string) => {
        if (curr === 'INR') return '₹';
        if (curr === 'EUR') return '€';
        if (curr === 'GBP') return '£';
        return '$';
    };

    const symbol = getCurrencySymbol(data.currency);

    return (
        <div style={{ width: '100%', marginTop: '20px', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
                <defs>
                    <linearGradient id="grid-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Y-Axis Grid Lines (5 lines) */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = height - padding - (ratio * chartHeight);
                    const price = minPrice + (ratio * range);
                    return (
                        <g key={ratio}>
                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                            <text x={padding - 5} y={y + 4} fontSize="10" fill="#64748b" textAnchor="end">{symbol}{price.toFixed(0)}</text>
                        </g>
                    );
                })}

                {/* Candles */}
                {data.close.map((close, i) => {
                    const open = data.open[i];
                    const high = data.high[i];
                    const low = data.low[i];

                    const x = padding + i * step;
                    const yHigh = getY(high);
                    const yLow = getY(low);
                    const yOpen = getY(open);
                    const yClose = getY(close);

                    const isGreen = close >= open;
                    const color = isGreen ? '#10b981' : '#ef4444';

                    // Body height must be at least 1px
                    let bodyY = Math.min(yOpen, yClose);
                    let bodyHeight = Math.abs(yClose - yOpen);
                    if (bodyHeight < 1) bodyHeight = 1;

                    return (
                        <g key={i}>
                            {/* Wick */}
                            <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1" />
                            {/* Body */}
                            <rect
                                x={x - candleWidth / 2}
                                y={bodyY}
                                width={candleWidth}
                                height={bodyHeight}
                                fill={color}
                                stroke={color}
                            />
                        </g>
                    );
                })}

                {/* X-Axis Labels (Show ~5 labels) */}
                {data.dates.map((date, i) => {
                    if (i % Math.ceil(count / 5) === 0) {
                        const x = padding + i * step;
                        return (
                            <text key={i} x={x} y={height - 10} fontSize="10" fill="#64748b" textAnchor="middle">
                                {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </text>
                        );
                    }
                    return null;
                })}
            </svg>
        </div>
    );
};

const AnalysisPage: React.FC = () => {
    const { activeStock, analysisData, setAnalysisData } = useStock();
    const [activeTab, setActiveTab] = useState('Fundamental');
    const [chatMessages, setChatMessages] = useState<any[]>([
        { sender: 'ai', text: 'Hello! I am your AI stock assistant. Ask me anything about your selected stock.', timestamp: new Date() }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // State for storing analysis reports
    // analysisData is now managed in StockContext
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Chart period state
    const [chartPeriod, setChartPeriod] = useState('6mo');

    const tabs = [
        { id: 'Fundamental', label: 'Fundamental Analysis' },
        { id: 'Technical', label: 'Technical Analysis' },
        { id: 'Risk', label: 'Risk Analysis' },
        { id: 'Sentiment', label: 'Sentiment Analysis' },
        { id: 'News', label: 'News Analysis' },
        { id: 'Advisor', label: 'AI Advisor' },
    ];

    useEffect(() => {
        if (activeStock) {
            fetchAnalysis(activeStock, activeTab, activeTab === 'Technical' ? chartPeriod : undefined);
        }
    }, [activeStock, activeTab, chartPeriod]);

    const fetchAnalysis = async (ticker: string, type: string, period?: string) => {
        const cacheKey = `${ticker}-${type}${type === 'Technical' ? '-' + period : ''}`;

        if (analysisData[cacheKey]) return;

        setLoading(prev => ({ ...prev, [type]: true }));
        setErrors(prev => ({ ...prev, [type]: '' }));

        try {
            const response = await analysisService.triggerAnalysis(ticker, type, period);
            setAnalysisData(prev => ({ ...prev, [cacheKey]: response.data }));
        } catch (error: any) {
            console.error(`Error fetching ${type} analysis:`, error);
            setErrors(prev => ({ ...prev, [type]: 'Failed to generate analysis. Please try again.' }));
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleSendMessage = async (message: string) => {
        const userMsg = { sender: 'user', text: message, timestamp: new Date() };
        setChatMessages(prev => [...prev, userMsg]);

        setIsTyping(true);
        try {
            const response = await chatService.sendMessage(message, activeStock || undefined);
            const aiMsg = {
                sender: 'ai',
                text: response.data.text,
                timestamp: new Date(response.data.timestamp)
            };
            setChatMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = { sender: 'ai', text: 'Sorry, I am having trouble connecting to the AI service.', timestamp: new Date() };
            setChatMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const getCurrencySymbol = (curr?: string) => {
        if (curr === 'INR') return '₹';
        if (curr === 'EUR') return '€';
        if (curr === 'GBP') return '£';
        return '$';
    };

    const renderReport = (type: string) => {
        const cacheKey = `${activeStock}-${type}${type === 'Technical' ? '-' + chartPeriod : ''}`;
        const data = analysisData[cacheKey];
        const isLoading = loading[type];
        const error = errors[type];

        if (isLoading) {
            return (
                <div className="analysis-placeholder">
                    <h2>Generating {type} Report</h2>
                    <p>Our AI agents are analyzing data sources...</p>
                    <div className="loading-spinner-placeholder"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="analysis-placeholder">
                    <h2 style={{ color: '#ef4444' }}>Analysis Failed</h2>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={() => fetchAnalysis(activeStock!, type, chartPeriod)}>Retry</button>
                </div>
            );
        }

        if (!data) return null;

        // OHLC Data for display
        let lastCandle = null;
        if (data.chart_data && data.chart_data.close && data.chart_data.close.length > 0) {
            const len = data.chart_data.close.length;
            lastCandle = {
                open: data.chart_data.open[len - 1],
                high: data.chart_data.high[len - 1],
                low: data.chart_data.low[len - 1],
                close: data.chart_data.close[len - 1],
                date: data.chart_data.dates[len - 1]
            };
        }

        const symbol = getCurrencySymbol(data.chart_data?.currency);

        return (
            <div className="analysis-report">
                <div className="report-header">
                    <div className="report-title-section">
                        <h3>{data.type} Report for {data.ticker}</h3>
                        <span className="report-timestamp">{new Date().toLocaleDateString()}</span>
                    </div>
                    {data.rating && (
                        <div className={`rating-badge ${data.rating.toLowerCase().replace(/\s+/g, '-')}`}>
                            {data.rating}
                        </div>
                    )}
                </div>

                <div className="report-summary">
                    <h4>Executive Summary</h4>
                    <div className="summary-content">
                        {data.summary.split('\n').map((line: string, i: number) => {
                            const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                            if (linkMatch) {
                                const [fullMatch, text, url] = linkMatch;
                                const parts = line.split(fullMatch);
                                return (
                                    <p key={i}>
                                        {parts[0]}
                                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                            {text}
                                        </a>
                                        {parts[1]}
                                    </p>
                                );
                            }
                            const boldMatch = line.match(/\*\*(.*?)\*\*/);
                            if (boldMatch) {
                                const [full, content] = boldMatch;
                                const parts = line.split(full);
                                return (
                                    <p key={i}>
                                        {parts[0]}
                                        <strong>{content}</strong>
                                        {parts[1]}
                                    </p>
                                );
                            }
                            return <p key={i} style={{ minHeight: line.trim() ? 'auto' : '10px' }}>{line}</p>;
                        })}
                    </div>
                </div>

                {/* Render Chart if available */}
                {type === 'Technical' && data.chart_data && (
                    <div className="chart-section" style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h4>Price History</h4>
                                {lastCandle && (
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                                        <span>O: <span style={{ color: '#1e293b' }}>{symbol}{lastCandle.open}</span></span>
                                        <span>H: <span style={{ color: '#1e293b' }}>{symbol}{lastCandle.high}</span></span>
                                        <span>L: <span style={{ color: '#1e293b' }}>{symbol}{lastCandle.low}</span></span>
                                        <span>C: <span style={{ color: lastCandle.close >= lastCandle.open ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{symbol}{lastCandle.close}</span></span>
                                    </div>
                                )}
                            </div>

                            <div className="chart-controls" style={{ display: 'flex', gap: 8 }}>
                                {['1mo', '3mo', '6mo', '1y'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setChartPeriod(p)}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #cbd5e1',
                                            background: chartPeriod === p ? '#2563eb' : 'white',
                                            color: chartPeriod === p ? 'white' : '#64748b',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {p.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <CandlestickChart data={data.chart_data} />
                    </div>
                )}

                {data.key_metrics && Object.keys(data.key_metrics).length > 0 && (
                    <div className="metrics-grid">
                        {Object.entries(data.key_metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="metric-card">
                                <span className="metric-label">{key}</span>
                                <span className="metric-value">{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (!activeStock && activeTab !== 'Advisor') {
            return (
                <div className="analysis-placeholder">
                    <h2>No Stock Selected</h2>
                    <p>Please enter a stock ticker in the header to begin analysis.</p>
                </div>
            );
        }

        if (activeTab === 'Advisor') {
            return (
                <div className="advisor-container">
                    {activeStock && renderReport('Advisor')}

                    <div className="advisor-chat-container" style={{ marginTop: '24px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ marginBottom: '16px', color: '#1e293b' }}>Ask Follow-up Questions</h4>
                        <ChatHistory messages={chatMessages} isTyping={isTyping} />
                        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
                    </div>
                </div>
            );
        }

        return renderReport(activeTab);
    };

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h1>Analysis {activeStock ? `- ${activeStock}` : ''}</h1>
            </div>

            <div className="tabs-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-content" style={activeTab === 'Advisor' ? { padding: 0 } : {}}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AnalysisPage;
