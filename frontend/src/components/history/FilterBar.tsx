import React from 'react';

const FilterBar: React.FC = () => {
    return (
        <div className="filter-bar">
            <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search by ticker..." className="history-search-input" />
            </div>
            <div className="filter-group">
                <select className="filter-select">
                    <option value="all">All Types</option>
                    <option value="technical">Technical</option>
                    <option value="fundamental">Fundamental</option>
                    <option value="sentiment">Sentiment</option>
                </select>
                <select className="filter-select">
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest</option>
                    <option value="rating">Rating</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
