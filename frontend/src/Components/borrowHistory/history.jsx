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
import { apiRequest } from "../../api";

const BorrowHistory = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const fetchHistory = async () => {
      try {
        const response = await apiRequest(`/borrows/my-borrows/`, {
          auth: true,
        });

        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching borrow history:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    return () => {
      document.body.classList.remove("dashboard-active");
      document.body.style.background = "";
    };
  }, []);

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
              <th>Due Date</th>
              <th>Returned Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{item.book?.title || "Unknown Book"}</td>
                <td>{new Date(item.borrowDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      item.status === "returned" ? "returned" : "not-returned"
                    }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td>
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  {item.returnedDate
                    ? new Date(item.returnedDate).toLocaleDateString()
                    : "Not returned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE CARD VIEW */}
        <div className="history-cards">
          {history.map((item) => (
            <div className="history-card" key={item._id}>
              <p>
                <strong>Book:</strong> {item.book?.title || "Unknown Book"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.borrowDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`status-badge ${
                    item.status === "returned" ? "returned" : "not-returned"
                  }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString()
                  : "—"}
              </p>

              <p>
                <strong>Returned Date:</strong>{" "}
                {item.returnedDate
                  ? new Date(item.returnedDate).toLocaleDateString()
                  : "Not returned"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowHistory;
