import React from 'react';
import { useStock } from '../../context/StockContext';

const StockSummaryCard: React.FC = () => {
    const { activeStock } = useStock();

    if (!activeStock) {
        return (
            <div className="stock-summary-card empty">
                <p>Please select a stock to see the summary.</p>
            </div>
        );
    }

    return (
        <div className="stock-summary-card">
            <div className="card-header">
                <h3>Stock Summary: {activeStock}</h3>
            </div>
            <div className="card-body">
                <div className="stock-price-section">
                    <span className="stock-name">Apple Inc. (AAPL)</span>
                    <div className="stock-price">
                        <span className="price">$34.00</span>
                        <span className="change positive">+$0.15 (+0.00%)</span>
                    </div>
                </div>

                <div className="technical-indicators">
                    <div className="indicator">
                        <span className="label">Trend:</span>
                        <span className="value">Bullish</span>
                    </div>
                    <div className="indicator">
                        <span className="label">RSI:</span>
                        <span className="value">65 (Approaching Overbought)</span>
                    </div>
                    <div className="indicator">
                        <span className="label">50-Day MA:</span>
                        <span className="value upward">Upward</span>
                    </div>
                    <div className="indicator">
                        <span className="label">200-Day MA:</span>
                        <span className="value upward">Upward</span>
                    </div>
                </div>

                <div className="mini-chart-placeholder">
                    <span>Mini Chart Placeholder</span>
                    <div className="chart-line"></div>
                </div>

                <div className="key-stats">
                    <h4>Key Stats</h4>
                    <div className="stats-grid">
                        <div className="stat-row">
                            <span>High Price</span>
                            <span>$34.00</span>
                        </div>
                        <div className="stat-row">
                            <span>Low Price</span>
                            <span>$6.10</span>
                        </div>
                        <div className="stat-row">
                            <span>Early Price</span>
                            <span>$34.25</span>
                        </div>
                        <div className="stat-row">
                            <span>Market Value</span>
                            <span>AAP0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockSummaryCard;
