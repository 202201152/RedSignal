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
                <div className={styles.sidebarTop}>
                    <div className={styles.brandContainer}>
                         <div className={styles.brandLogomark} />
                         <h1 className={styles.brand}>RedSignal</h1>
                    </div>
                    
                    <nav className={styles.nav}>
                        <p className={styles.navHeader}>MENU</p>
                        <Link to="/dashboard" className={styles.navLink}>
                            <span>Dashboard</span>
                        </Link>
                        {user?.role === 'ngo' && (
                            <Link to="/ngo" className={styles.navLink}>
                                <span>NGO Panel</span>
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className={styles.navLink}>
                                <span>Admin Panel</span>
                            </Link>
                        )}
                    </nav>
                </div>

                <div className={styles.userProfile}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name || 'User'}</span>
                            <span className={styles.userRole}>{user?.role || 'Volunteer'}</span>
                        </div>
                    </div>
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