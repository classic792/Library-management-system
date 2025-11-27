import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { FaBook, FaBookmark, FaUsers, FaChartLine, FaTh, FaPlus, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if a route is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Handle logout
    const handleLogout = () => {
        // Clear any stored authentication data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userToken');
        sessionStorage.clear();
        
        // Redirect to landing page
        navigate('/');
    };

    // Remove background image when component mounts
    useEffect(() => {
        document.body.classList.add('dashboard-active');
        
        // Remove background image and set to white
        document.body.style.background = 'white';
        document.body.style.backgroundImage = 'none';
        document.body.style.overflow = 'auto';
        document.body.style.display = 'block';
        
        return () => {
            document.body.classList.remove('dashboard-active');
            document.body.style.background = '';
            document.body.style.backgroundImage = '';
            document.body.style.overflow = '';
            document.body.style.display = '';
        };
    }, []);
    // Mock data - replace with API calls later
    const stats = {
        totalBooks: 0,
        available: 0,
        borrowed: 0,
        totalCopies: 0
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <Link to="/admin/dashboard" className="logo-container" style={{ textDecoration: 'none' }}>
                    <div className="logo-icon">
                        <div className="logo-line logo-line-1"></div>
                        <div className="logo-line logo-line-2"></div>
                        <div className="logo-line logo-line-3"></div>
                    </div>
                    <span className="logo-text">LibraSystem</span>
                </Link>
                <nav className="dashboard-nav">
                    <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                        <FaTh className="nav-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/books" className={`nav-item ${isActive('/admin/books') ? 'active' : ''}`}>
                        <FaBook className="nav-icon" />
                        <span>Books</span>
                    </Link>
                    <Link to="/admin/add-book" className={`nav-item ${isActive('/admin/add-book') ? 'active' : ''}`}>
                        <FaPlus className="nav-icon" />
                        <span>Add Book</span>
                    </Link>
                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <FaSignOutAlt className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </nav>
                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <div 
                className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <nav 
                    className="mobile-menu"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Link 
                        to="/admin/dashboard" 
                        className={`mobile-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaTh className="nav-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link 
                        to="/admin/books" 
                        className={`mobile-nav-item ${isActive('/admin/books') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaBook className="nav-icon" />
                        <span>Books</span>
                    </Link>
                    <Link 
                        to="/admin/add-book" 
                        className={`mobile-nav-item ${isActive('/admin/add-book') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaPlus className="nav-icon" />
                        <span>Add Book</span>
                    </Link>
                    <button 
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogout();
                        }} 
                        className="mobile-nav-item logout-btn"
                    >
                        <FaSignOutAlt className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-title-section">
                    <h1 className="dashboard-title">Library Dashboard</h1>
                    <p className="dashboard-subtitle">Overview of your library management system</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-info">
                                <h3 className="stat-title">Total Books</h3>
                                <p className="stat-value">{stats.totalBooks}</p>
                                <p className="stat-description">Unique titles</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <FaBook className="stat-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-info">
                                <h3 className="stat-title">Available</h3>
                                <p className="stat-value">{stats.available}</p>
                                <p className="stat-description">Ready to borrow</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <FaBookmark className="stat-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-info">
                                <h3 className="stat-title">Borrowed</h3>
                                <p className="stat-value">{stats.borrowed}</p>
                                <p className="stat-description">Currently out</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <FaUsers className="stat-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div className="stat-info">
                                <h3 className="stat-title">Total Copies</h3>
                                <p className="stat-value">{stats.totalCopies}</p>
                                <p className="stat-description">All copies</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <FaChartLine className="stat-icon" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="welcome-section">
                    <h2 className="welcome-title">Welcome to LibraSystem</h2>
                    <p className="welcome-text">
                        Manage your library efficiently with our comprehensive book management system. 
                        Track books, monitor availability, and organize your collection with ease.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;