import React from 'react';
import '../styles/dashboard.css';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentNews from '../components/dashboard/RecentNews';
import TrendingWatchlist from '../components/dashboard/TrendingWatchlist';
import StockSummaryCard from '../components/advisor/StockSummaryCard';
import { useNavigate } from 'react-router-dom';

const AdvisorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Market Dashboard</h1>
                <p>Welcome back, John. Here is what is happening in the market today.</p>
            </div>

            <DashboardStats />

            <div className="dashboard-main-grid">
                <div className="dashboard-left-col">
                    <RecentNews />
                </div>
                <div className="dashboard-right-col">
                    <TrendingWatchlist />
                    <div style={{ marginTop: '24px' }}>
                        <StockSummaryCard />
                    </div>
                </div>
            </div>

            <div className="dashboard-advisor-section">
                <div className="advisor-promo-content">
                    <h2>AI Stock Advisor</h2>
                    <p>Get personalized investment insights and deep analysis for any stock ticker.</p>
                    <button className="advisor-cta-btn" onClick={() => navigate('/analysis')}>
                        Start New Analysis
                    </button>
                </div>
                <div className="advisor-promo-icon" style={{ fontSize: '3rem' }}>🤖</div>
            </div>
        </div>
    );
};

export default AdvisorPage;
