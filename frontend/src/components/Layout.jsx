import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css'; // Import the CSS Module
import { FiMenu, FiX } from 'react-icons/fi';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Close sidebar when route changes (mobile UX)
    React.useEffect(() => {
        closeSidebar();
    }, [location]);

    return (
        <div className={styles.layoutContainer}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <div className={styles.brandContainerMobile}>
                    <div className={styles.brandLogomark} />
                    <h1 className={styles.brand}>RedSignal</h1>
                </div>
                <button className={styles.hamburger} onClick={toggleSidebar}>
                    {isSidebarOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarTop}>
                    <div className={styles.brandContainer}>
                        <div className={styles.brandLogomark} />
                        <h1 className={styles.brand}>RedSignal</h1>
                    </div>

                    <nav className={styles.nav}>
                        <p className={styles.navHeader}>MENU</p>
                        <Link to="/dashboard" className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}>
                            <span>Dashboard</span>
                        </Link>
                        {user?.role === 'ngo' && (
                            <Link to="/ngo" className={`${styles.navLink} ${location.pathname === '/ngo' ? styles.active : ''}`}>
                                <span>NGO Panel</span>
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className={`${styles.navLink} ${location.pathname === '/admin' ? styles.active : ''}`}>
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

            {/* Overlay for mobile */}
            {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
