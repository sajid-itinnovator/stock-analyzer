import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-icon">📈</span>
                <span className="logo-text">StockAI</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }: { isActive: boolean }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Home</span>
                </NavLink>
                <NavLink to="/analysis" className={({ isActive }: { isActive: boolean }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Stocks</span>
                </NavLink>
                <NavLink to="/history" className={({ isActive }: { isActive: boolean }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">🕒</span>
                    <span className="nav-label">History</span>
                </NavLink>
                <NavLink to="/credentials" className={({ isActive }: { isActive: boolean }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">🔑</span>
                    <span className="nav-label">Credentials</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }: { isActive: boolean }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="nav-icon">👤</span>
                    <span className="nav-label">Profile</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <div className="user-brief">
                    <div className="user-avatar-sm">JD</div>
                    <div className="user-details-sm">
                        <span className="user-name-sm">John Doe</span>
                        <span className="user-plan-sm">Pro Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
