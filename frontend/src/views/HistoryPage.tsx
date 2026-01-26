import React, { useEffect, useState } from 'react';
import FilterBar from '../components/history/FilterBar';
import HistoryTable from '../components/history/HistoryTable';
import HistoryCard from '../components/history/HistoryCard';
import { historyService } from '../services/api';

const HistoryPage: React.FC = () => {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await historyService.getHistory();
            setHistoryData(response.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return <div className="loading-container">Loading history...</div>;
    }

    return (
        <div className="history-view-container">
            <div className="history-header">
                <h1>Analysis History</h1>
                <FilterBar />
            </div>

            {/* Desktop view */}
            <div className="history-desktop-view">
                {historyData.length > 0 ? (
                    <HistoryTable data={historyData} />
                ) : (
                    <div className="empty-state">No analysis history found.</div>
                )}
            </div>

            {/* Mobile view */}
            <div className="history-mobile-view">
                {historyData.map(item => (
                    <HistoryCard key={item._id || item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
