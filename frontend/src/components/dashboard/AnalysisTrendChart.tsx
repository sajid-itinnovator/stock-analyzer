import React, { useEffect, useState } from 'react';
import { historyService } from '../../services/api';

interface DailyCount {
    date: string; // YYYY-MM-DD
    count: number;
    label: string; // Mon, Tue, etc.
}

const AnalysisTrendChart: React.FC = () => {
    const [stats, setStats] = useState<DailyCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalLast5Days, setTotalLast5Days] = useState(0);

    const fetchStats = async () => {
        try {
            const response = await historyService.getHistory();
            const history = response.data;

            // Calculate last 5 days
            const today = new Date();
            const days = [];
            for (let i = 4; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                days.push(d);
            }

            const statsMap = new Map<string, number>();
            days.forEach(d => {
                const key = d.toISOString().split('T')[0];
                statsMap.set(key, 0);
            });

            let count5Days = 0;
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 5);

            history.forEach((record: any) => {
                const date = new Date(record.timestamp);
                if (date > cutoff) {
                    count5Days++;
                    const key = date.toISOString().split('T')[0];
                    if (statsMap.has(key)) {
                        statsMap.set(key, (statsMap.get(key) || 0) + 1);
                    }
                }
            });

            setTotalLast5Days(count5Days);

            const chartData = days.map(d => {
                const key = d.toISOString().split('T')[0];
                return {
                    date: key,
                    count: statsMap.get(key) || 0,
                    label: d.toLocaleDateString(undefined, { weekday: 'short' })
                };
            });

            setStats(chartData);

        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Poll every 30 seconds for "real-time" updates
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="stat-card loading">Loading stats...</div>;

    const maxCount = Math.max(...stats.map(s => s.count), 1); // Avoid div by zero

    return (
        <div className="stat-card analysis-trend-card" style={{ gridColumn: 'span 2' }}>
            <div className="stat-header">
                <span className="stat-label">Analysis Trend (Last 5 Days)</span>
                <span className="stat-icon">📈</span>
            </div>
            <div className="stat-main-content" style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '10px' }}>
                <div className="total-count">
                    <div className="stat-value">{totalLast5Days}</div>
                    <div className="stat-subtext">Analyses</div>
                </div>

                <div className="mini-chart" style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: '60px', gap: '8px' }}>
                    {stats.map((day) => (
                        <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div
                                style={{
                                    width: '100%',
                                    background: '#3b82f6',
                                    borderRadius: '4px',
                                    height: `${(day.count / maxCount) * 100}%`,
                                    minHeight: day.count > 0 ? '4px' : '0',
                                    transition: 'height 0.3s ease'
                                }}
                                title={`${day.date}: ${day.count}`}
                            />
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{day.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisTrendChart;
