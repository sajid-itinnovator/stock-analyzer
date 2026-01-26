import React from 'react';
import AnalysisTrendChart from './AnalysisTrendChart';

interface StatCardProps {
    label: string;
    value: string;
    icon: string;
    trend?: string;
    trendType?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendType }) => (
    <div className="stat-card">
        <div className="stat-header">
            <span className="stat-label">{label}</span>
            <span className="stat-icon">{icon}</span>
        </div>
        <div className="stat-value">{value}</div>
        {trend && (
            <div className={`stat-trend ${trendType === 'up' ? 'trend-up' : 'trend-down'}`}>
                {trendType === 'up' ? '↗' : '↘'} {trend}
            </div>
        )}
    </div>
);

const DashboardStats: React.FC = () => {
    return (
        <div className="dashboard-stats-grid">
            <AnalysisTrendChart />
            <StatCard
                label="Saved Symbols"
                value="18"
                icon="⭐"
            />
            <StatCard
                label="Sentiment Score"
                value="72"
                icon="🎭"
                trend="Bullish"
                trendType="up"
            />
            <StatCard
                label="Recent News"
                value="45"
                icon="📰"
                trend="5 new items"
                trendType="up"
            />
        </div>
    );
};

export default DashboardStats;
