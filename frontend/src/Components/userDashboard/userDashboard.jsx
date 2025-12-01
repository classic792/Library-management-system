import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./userDashboard.css";
import {
  FaBook,
  FaHistory,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const UserDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    document.body.classList.add("dashboard-active");
    document.body.style.background = "white";

    return () => {
      document.body.classList.remove("dashboard-active");
      document.body.style.background = "";
    };
  }, []);

  // Mock Data — Replace with API Later
  const stats = {
    borrowedBooks: 0,
    reservedBooks: 0,
    returnedBooks: 0,
  };

  // sample recent activity
  const recentActivity = [
    { title: "The great Ezekiel", action: "Borrowed", date: "Jan 4, 2025" },
    {
      title: "History about Osman",
      action: "Returned",
      date: "Dec 1, 2025",
    },
  ];

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <Link to="/user/dashboard" className="logo-container">
          <div className="logo-icon">
            <div className="logo-line logo-line-1"></div>
            <div className="logo-line logo-line-2"></div>
            <div className="logo-line logo-line-3"></div>
          </div>
          <span className="logo-text">LibraSystem</span>
        </Link>

        <nav className="dashboard-nav">
          <Link
            to="/user/dashboard"
            className={`nav-item ${
              isActive("/user/dashboard") ? "active" : ""
            }`}>
            <FaBook /> <span>Dashboard</span>
          </Link>

          <Link
            to="/user/books"
            className={`nav-item ${isActive("/user/books") ? "active" : ""}`}>
            <FaBookmark /> <span>Available Books</span>
          </Link>

          <Link
            to="/user/history"
            className={`nav-item ${isActive("/user/history") ? "active" : ""}`}>
            <FaHistory /> <span>Borrow History</span>
          </Link>

          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </nav>

        {/* Mobile button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}>
        <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <Link
            to="/user/dashboard"
            className={`mobile-nav-item ${
              isActive("/user/dashboard") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaBook /> Dashboard
          </Link>

          <Link
            to="/user/books"
            className={`mobile-nav-item ${
              isActive("/user/books") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaBookmark /> Available Books
          </Link>

          <Link
            to="/user/history"
            className={`mobile-nav-item ${
              isActive("/user/history") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaHistory /> Borrow History
          </Link>

          <button
            className="mobile-nav-item logout-btn"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <h1 className="dashboard-title">
          Welcome Back, <s>USER</s>{" "}
        </h1>
        <p className="dashboard-subtitle">Here is your library activity</p>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Borrowed Books</h3>
            <p className="stat-value">{stats.borrowedBooks}</p>
          </div>

          <div className="stat-card">
            <h3>Reserved Books</h3>
            <p className="stat-value">{stats.reservedBooks}</p>
          </div>

          <div className="stat-card">
            <h3>Returned Books</h3>
            <p className="stat-value">{stats.returnedBooks}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2 className="section-title">Recent Activity</h2>

          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <div key={index} className="activity-item">
                <div>
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-date">{item.date}</p>
                </div>
                <span className={`activity-tag ${item.action.toLowerCase()}`}>
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
