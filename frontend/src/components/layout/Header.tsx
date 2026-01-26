import React from 'react';
import GlobalStockInput from '../common/GlobalStockInput';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-title">Stock Research Assistant</div>
            <GlobalStockInput />
        </header>
    );
};

export default Header;
