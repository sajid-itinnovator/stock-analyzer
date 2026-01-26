import React, { useEffect, useState } from 'react';
import { newsService } from '../../services/api';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: string;
    guid: string;
}

const RecentNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        try {
            const response = await newsService.getNews();
            setNews(response.data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, []);

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="dashboard-card">
            <div className="dashboard-card-header">
                <h3>Market News</h3>
                <span className="view-all-link">Live Feed</span>
            </div>
            <div className="news-list">
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading news...</div>
                ) : news.length > 0 ? (
                    news.map((item, index) => (
                        <div key={item.guid || index} className="news-item" onClick={() => window.open(item.link, '_blank')}>
                            <div className="news-meta">
                                <span className="news-source">{item.source}</span>
                                <span className="news-time">{getTimeAgo(item.pubDate)}</span>
                            </div>
                            <div className="news-content">
                                <h4>{item.title}</h4>
                                <p className="news-summary">{item.contentSnippet?.substring(0, 100)}...</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No news available.</div>
                )}
            </div>
        </div>
    );
};

export default RecentNews;
