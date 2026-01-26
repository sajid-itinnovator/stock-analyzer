import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main>{children}</main>
                <BottomNav />
            </div>
        </div>
    );
};

export default MainLayout;
