import "./history.css";
// import "../userDashboard/userDashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaHistory,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const BorrowHistory = () => {
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

  const history = [
    {
      id: 1,
      book: "Atomic Habits",
      dateBorrowed: "2025-01-02",
      returned: true,
    },
    { id: 2, book: "Clean Code", dateBorrowed: "2025-01-10", returned: false },
    {
      id: 3,
      book: "Rich Dad Poor Dad",
      dateBorrowed: "2025-01-12",
      returned: true,
    },
  ];

  return (
    <div className="history-container">
      {/* Header */}
      <header className="dashboard-header">
        <Link to="/user/dashboard" className="logo-container">
          <div className="logo-icon">
            <div className="logo-line logo-line-1"></div>
            <div className="logo-line logo-line-2"></div>
            <div className="logo-line logo-line-3"></div>
          </div>
          <span className="logo-text">GoldenIndex</span>
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
            to="/user/available-books"
            className={`nav-item ${
              isActive("/user/available-books") ? "active" : ""
            }`}>
            <FaBookmark /> <span>Available Books</span>
          </Link>

          <Link
            to="/user/borrow-history"
            className={`nav-item ${
              isActive("/user/borrow-history") ? "active" : ""
            }`}>
            <FaHistory /> <span>Borrow History</span>
          </Link>

          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </nav>
        {/* Mobile Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

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
            to="/user/available-books"
            className={`mobile-nav-item ${
              isActive("/user/available-books") ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}>
            <FaBookmark /> Available Books
          </Link>

          <Link
            to="/user/borrow-history"
            className={`mobile-nav-item ${
              isActive("/user/borrow-history") ? "active" : ""
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

      <h2 className="title">Borrow History</h2>
      <div className="history-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Date Borrowed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.book}</td>
                <td>{item.dateBorrowed}</td>
                <td>
                  <span
                    className={`status-badge ${
                      item.returned ? "returned" : "not-returned"
                    }`}>
                    {item.returned ? "Returned" : "Not Returned"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE CARD VIEW */}
        <div className="history-cards">
          {history.map((item) => (
            <div className="history-card" key={item.id}>
              <p>
                <strong>Book:</strong> {item.book}
              </p>
              <p>
                <strong>Date:</strong> {item.dateBorrowed}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`status-badge ${
                    item.returned ? "returned" : "not-returned"
                  }`}>
                  {item.returned ? "Returned" : "Not Returned"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowHistory;
