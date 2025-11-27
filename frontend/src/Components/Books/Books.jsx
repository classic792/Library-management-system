import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Books.css";
import { FaBook, FaPlus, FaBars, FaTimes, FaTh, FaSignOutAlt } from "react-icons/fa";

const Books = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    return (
        <div className="books-page">
            {/* Header */}
            <header className="books-header">
                <Link to="/admin/dashboard" className="logo-container" style={{ textDecoration: 'none' }}>
                    <div className="logo-icon">
                        <div className="logo-line logo-line-1"></div>
                        <div className="logo-line logo-line-2"></div>
                        <div className="logo-line logo-line-3"></div>
                    </div>
                    <span className="logo-text">LibraSystem</span>
                </Link>
                <nav className="books-nav">
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
            <main className="books-main">
                <div className="books-title-section">
                    <h1 className="books-title">Books</h1>
                    <p className="books-subtitle">Manage your library books</p>
                </div>

                <div className="books-section">
                    <h2 className="books-section-title">Books Page</h2>
                    <p className="books-section-text">
                        This page will display all books in your library. You'll be able to view, search, edit, and manage books here.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Books;