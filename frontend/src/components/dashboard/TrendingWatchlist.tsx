import React from 'react';

const trendingStocks = [
    { ticker: 'RELIANCE.NS', name: 'Reliance Industries', price: '₹2,745.00', change: '+1.2%' },
    { ticker: 'TCS.NS', name: 'Tata Consultancy Svcs', price: '₹3,980.50', change: '-0.5%' },
    { ticker: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', price: '₹1,450.25', change: '+0.8%' },
    { ticker: 'INFY.NS', name: 'Infosys Limited', price: '₹1,560.80', change: '+2.1%' },
    { ticker: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', price: '₹1,090.40', change: '-0.3%' },
];

const TrendingWatchlist: React.FC = () => {
    return (
        <div className="dashboard-card">
            <div className="dashboard-card-header">
                <h3>Trending Stocks</h3>
                <a href="#" className="view-all-link">Full List</a>
            </div>
            <div className="trending-list">
                {trendingStocks.map(stock => (
                    <div key={stock.ticker} className="trending-item">
                        <div className="ticker-info">
                            <span className="ticker-symbol">{stock.ticker}</span>
                            <span className="ticker-name">{stock.name}</span>
                        </div>
                        <div className="trending-stats">
                            <span className="trending-price">{stock.price}</span>
                            <span className={`trending-change ${stock.change.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                                {stock.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingWatchlist;
