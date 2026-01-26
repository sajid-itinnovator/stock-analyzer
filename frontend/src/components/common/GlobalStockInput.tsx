import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';

const GlobalStockInput: React.FC = () => {
    const { activeStock, setActiveStock } = useStock();
    const [inputValue, setInputValue] = useState(activeStock || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setActiveStock(inputValue.toUpperCase());
        }
    };

    return (
        <div className="global-stock-input">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter stock ticker (e.g. AAPL)..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">Analyze</button>
            </form>
            {activeStock && (
                <div className="active-ticker-display">
                    Active: <strong>{activeStock}</strong>
                </div>
            )}
        </div>
    );
};

export default GlobalStockInput;
