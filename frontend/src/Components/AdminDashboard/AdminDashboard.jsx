import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import {
  FaBook,
  FaBookmark,
  FaUsers,
  FaChartLine,
  FaTh,
  FaPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

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
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    sessionStorage.clear();

    // Redirect to landing page
    navigate("/");
  };

  // Remove background image when component mounts
  useEffect(() => {
    document.body.classList.add("dashboard-active");

    // Remove background image and set to white
    document.body.style.background = "white";
    document.body.style.backgroundImage = "none";
    document.body.style.overflow = "auto";
    document.body.style.display = "block";

    return () => {
      document.body.classList.remove("dashboard-active");
      document.body.style.background = "";
      document.body.style.backgroundImage = "";
      document.body.style.overflow = "";
      document.body.style.display = "";
    };
  }, []);

  // Mock data (will be replaced by API call)
  const stats = {
    totalBooks: 0,
    available: 0,
    borrowed: 0,
    totalCopies: 0,
  };

  // Data for Category Distribution
  const categoryData = [
    { name: "Fiction", value: 0, color: "#4a90e2", percentage: 0 },
    { name: "Science", value: 0, color: "#50c878", percentage: 0 },
    { name: "History", value: 0, color: "#f39c12", percentage: 0 },
    { name: "Technology", value: 0, color: "#e74c3c", percentage: 0 },
    { name: "Biography", value: 0, color: "#9b59b6", percentage: 0 },
    { name: "Children", value: 0, color: "#34495e", percentage: 0 },
    { name: "Romance", value: 0, color: "#ff3e5b", percentage: 0 },
  ];

  // Data for Books Added Over Time
  const monthlyData = [
    { month: "Jan", books: 0 },
    { month: "Feb", books: 0 },
    { month: "Mar", books: 0 },
    { month: "Apr", books: 0 },
    { month: "May", books: 0 },
    { month: "Jun", books: 0 },
    { month: "Jul", books: 0 },
    { month: "Aug", books: 0 },
    { month: "Sep", books: 0 },
    { month: "Oct", books: 0 },
    { month: "Nov", books: 0 },
    { month: "Dec", books: 0 },
  ];

  // Data for Book Status
  const statusData = [
    { status: "Available", count: 0, color: "#50c878" },
    { status: "Borrowed", count: 0, color: "#f39c12" },
    { status: "Reserved", count: 0, color: "#4a90e2" },
    { status: "Overdue", count: 0, color: "#e74c3c" },
  ];

  const maxMonthlyBooks = Math.max(...monthlyData.map((d) => d.books));
  const maxStatusCount = Math.max(...statusData.map((d) => d.count));

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <Link
          to="/admin/dashboard"
          className="logo-container"
          style={{ textDecoration: "none" }}>
          <div className="logo-icon">
            <div className="logo-line logo-line-1"></div>
            <div className="logo-line logo-line-2"></div>
            <div className="logo-line logo-line-3"></div>
          </div>
          <span className="logo-text">LibraSystem</span>
        </Link>
        <nav className="dashboard-nav">
          <Link
            to="/admin/dashboard"
            className={`nav-item ${
              isActive("/admin/dashboard") ? "active" : ""
            }`}>
            <FaTh className="nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/books"
            className={`nav-item ${isActive("/admin/books") ? "active" : ""}`}>
            <FaBook className="nav-icon" />
            <span>Books</span>
          </Link>
          <Link
            to="/admin/add-book"
            className={`nav-item ${
              isActive("/admin/add-book") ? "active" : ""
            }`}>
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
          aria-label="Toggle menu">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}>
        <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <Link
            to="/admin/dashboard"
            className={`mobile-nav-item ${
              isActive("/admin/dashboard") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaTh className="nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/books"
            className={`mobile-nav-item ${
              isActive("/admin/books") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaBook className="nav-icon" />
            <span>Books</span>
          </Link>
          <Link
            to="/admin/add-book"
            className={`mobile-nav-item ${
              isActive("/admin/add-book") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaPlus className="nav-icon" />
            <span>Add Book</span>
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="mobile-nav-item logout-btn">
            <FaSignOutAlt className="nav-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Library Dashboard</h1>
          <p className="dashboard-subtitle">
            Overview of your library management system
          </p>
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

        {/* Chart section */}
        <div className="charts-section">
          <div className="charts-grid">
            {/* Category Distribution - Custom Bar Chart */}
            <div className="chart-card">
              <h2 className="chart-title">Category Distribution</h2>
              <div className="custom-chart">
                {categoryData.map((category, index) => (
                  <div key={index} className="chart-bar-row">
                    <div className="chart-label">{category.name}</div>
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}>
                        <span className="chart-bar-value">
                          {category.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Status - Custom Bar Chart */}
            <div className="chart-card">
              <h2 className="chart-title">Book Status Overview</h2>
              <div className="custom-chart">
                {statusData.map((status, index) => (
                  <div key={index} className="chart-bar-row">
                    <div className="chart-label">{status.status}</div>
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar"
                        style={{
                          width: `${(status.count / maxStatusCount) * 100}%`,
                          backgroundColor: status.color,
                        }}>
                        <span className="chart-bar-value">{status.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Books Added Over Time - Custom Line Chart */}
          <div className="chart-card full-width">
            <h2 className="chart-title">Books Added Over Time</h2>
            <div className="line-chart">
              <div className="line-chart-grid">
                {monthlyData.map((data, index) => (
                  <div key={index} className="line-chart-bar">
                    <div
                      className="line-chart-column"
                      style={{
                        height: `${(data.books / maxMonthlyBooks) * 100}%`,
                        backgroundColor: "#f39c12",
                      }}>
                      <span className="line-chart-value">{data.books}</span>
                    </div>
                    <div className="line-chart-label">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
