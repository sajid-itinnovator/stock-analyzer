import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }: { isActive: boolean }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
                <span className="bottom-nav-icon">🏠</span>
                <span className="bottom-nav-label">Dashboard</span>
            </NavLink>
            <NavLink to="/analysis" className={({ isActive }: { isActive: boolean }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
                <span className="bottom-nav-icon">📊</span>
                <span className="bottom-nav-label">Analysis</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }: { isActive: boolean }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
                <span className="bottom-nav-icon">🕒</span>
                <span className="bottom-nav-label">History</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }: { isActive: boolean }) => isActive ? 'bottom-nav-item active' : 'bottom-nav-item'}>
                <span className="bottom-nav-icon">👤</span>
                <span className="bottom-nav-label">Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
