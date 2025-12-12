import "./availableBooks.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../api";
import "../userDashboard/userDashboard.css";
import {
  FaBook,
  FaHistory,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const AvailableBooks = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    message: "",
    type: "", // success, error, info
    visible: false,
  });
  const [modal, setModal] = useState({
    isOpen: false,
    bookId: null,
    bookTitle: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.clear();
    navigate("/");
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const initiateBorrow = (book) => {
    setModal({
      isOpen: true,
      bookId: book._id,
      bookTitle: book.title,
    });
  };

  const confirmBorrow = async () => {
    if (!modal.bookId) return;

    try {
      await apiRequest(`/books/${modal.bookId}/borrow`, {
        method: "POST",
        auth: true,
        body: { dueDateDays: 14 }, // Default 14 days
      });
      showNotification("Book borrowed successfully!", "success");
      setModal({ isOpen: false, bookId: null, bookTitle: "" });
      // Refresh list to update availability
      fetchBooks();
    } catch (err) {
      console.error("Error borrowing book:", err);
      showNotification(err.message || "Failed to borrow book", "error");
      setModal({ isOpen: false, bookId: null, bookTitle: "" });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, bookId: null, bookTitle: "" });
  };

  useEffect(() => {
    document.body.classList.add("dashboard-active");
    document.body.style.background = "white";

    fetchBooks();

    return () => {
      document.body.classList.remove("dashboard-active");
      document.body.style.background = "";
    };
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/books", { auth: true });
      // Backend returns { message: "...", data: [...] }
      setBooks(res.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load available books.");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (bookId) => {
    showNotification("Reserve feature coming soon!", "info");
  };

  const filteredBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return books.filter((book) => {
      const inTitle = book.title?.toLowerCase().includes(term);
      const inAuthor = book.author?.toLowerCase().includes(term);
      return inTitle || inAuthor;
    });
  }, [books, searchTerm]);

  return (
    <div className="books-page">
      {/* Notification Toast */}
      {notification.visible && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Borrow</h3>
            <p>
              Are you sure you want to borrow <strong>{modal.bookTitle}</strong>
              ?
            </p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={confirmBorrow}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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

      <h2 className="title">Available Books</h2>

      {/* Search bar */}
      <div className="books-search-bar">
        <div className="books-search-input-wrapper">
          <FaSearch className="books-search-icon" />
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading books...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div className="book-card" key={book._id}>
                {book.imageUrl && (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="book-cover-small"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>

                <span
                  className={`status ${
                    isAvailable ? "available" : "unavailable"
                  }`}>
                  {isAvailable
                    ? `Available (${book.availableCopies})`
                    : "Borrowed"}
                </span>

                <div className="book-actions">
                  {isAvailable ? (
                    <button
                      className="borrow-btn"
                      onClick={() => initiateBorrow(book)}>
                      Borrow
                    </button>
                  ) : (
                    <button className="borrow-btn disabled" disabled>
                      Out of Stock
                    </button>
                  )}

                  {/* <button
                    className="reserve-btn"
                    onClick={() => handleReserve(book._id)}
                    style={{
                      marginLeft: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#f0ad4e",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}>
                    Reserve
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableBooks;
