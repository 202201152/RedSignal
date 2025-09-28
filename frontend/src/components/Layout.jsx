import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css'; // Import the CSS Module

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={styles.layoutContainer}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div>
                    <h1 className={styles.brand}>Disaster.io</h1>
                    <nav className={styles.nav}>
                        <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
                        {user?.role === 'admin' && <Link to="/admin" className={styles.navLink}>Admin Panel</Link>}
                        {user?.role === 'ngo' && <Link to="/ngo" className={styles.navLink}>NGO Panel</Link>}
                    </nav>
                </div>
                <div className={styles.userProfile}>
                    <span className={styles.userName}>{user?.name || 'User'}</span>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;