import React, { createContext, useContext, useState } from 'react';

interface StockContextType {
    activeStock: string | null;
    setActiveStock: (ticker: string) => void;
    analysisData: Record<string, any>;
    setAnalysisData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeStock, setActiveStockState] = useState<string | null>(null);
    const [analysisData, setAnalysisData] = useState<Record<string, any>>({});

    const setActiveStock = (ticker: string) => {
        if (ticker !== activeStock) {
            setActiveStockState(ticker);
            setAnalysisData({}); // Clear cache when switching stocks
        }
    };

    return (
        <StockContext.Provider value={{ activeStock, setActiveStock, analysisData, setAnalysisData }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStock = () => {
    const context = useContext(StockContext);
    if (!context) throw new Error('useStock must be used within StockProvider');
    return context;
};
