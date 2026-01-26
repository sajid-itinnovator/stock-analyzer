import React from 'react';

interface HistoryItem {
    id: string;
    ticker: string;
    type: string;
    date: string;
    rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
}

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const getRatingClass = (rating: string) => {
        return rating.toLowerCase().replace(' ', '-');
    };

    return (
        <div className="history-mobile-card">
            <div className="card-top">
                <span className="ticker-badge">{item.ticker}</span>
                <span className={`rating-badge ${getRatingClass(item.rating)}`}>
                    {item.rating}
                </span>
            </div>
            <div className="card-mid">
                <div className="type-info">
                    <span className="label">Type:</span>
                    <span className="value">{item.type}</span>
                </div>
                <div className="date-info">
                    <span className="label">Date:</span>
                    <span className="value">{item.date}</span>
                </div>
            </div>
            <button className="mobile-view-btn">View Full Report</button>
        </div>
    );
};

export default HistoryCard;
