import React from 'react';

interface HistoryItem {
    id: string;
    ticker: string;
    type: string;
    date: string;
    rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
}

const HistoryTable: React.FC<{ data: HistoryItem[] }> = ({ data }) => {
    const getRatingClass = (rating: string) => {
        return rating.toLowerCase().replace(' ', '-');
    };

    return (
        <div className="history-table-container">
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Stock Ticker</th>
                        <th>Analysis Type</th>
                        <th>Date Analyzed</th>
                        <th>AI Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="ticker-cell"><strong>{item.ticker}</strong></td>
                            <td>{item.type}</td>
                            <td>{item.date}</td>
                            <td>
                                <span className={`rating-badge ${getRatingClass(item.rating)}`}>
                                    {item.rating}
                                </span>
                            </td>
                            <td>
                                <button className="view-report-btn">View Report</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
