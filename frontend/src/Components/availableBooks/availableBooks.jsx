import "./availableBooks.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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

  // API call to fetch available books

  const [books, setBooks] = useState([]);
  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await fetch("http://localhost:3000/api/books/available", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setBooks(data.books || []);
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  };

  fetchBooks();
}, []);



  const filteredBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    //  if (!term) return books;
    return books.filter((book) => {
      const inTitle = book.title.toLowerCase().includes(term);
      const inAuthor = book.author.toLowerCase().includes(term);
      return inTitle || inAuthor;
    });
  }, [books, searchTerm]);

  return (
    <div className="books-page">
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

      {/* Search bar (title / author / ISBN / category during integration) */}
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

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book.id}>
            <h3>{book.title}</h3>
            <p className="author">by {book.author}</p>

            <span
              className={`status ${
                book.availableCopies > 0 ? "Available" : "Borrowed"
              }`}>
              {book.availableCopies > 0 ? "Available" : "Borrowed"}
            </span>

            {book.availableCopies > 0 ? (
              <button className="borrow-btn">Borrow Book</button>
            ) : (
              <button className="borrow-btn disabled" disabled>
                Not Available
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableBooks;
