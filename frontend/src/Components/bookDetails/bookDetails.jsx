import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../api";
import "./bookDetails.css";
import "../AdminDashboard/AdminDashboard.css";
import {
  FaBook,
  FaTh,
  FaPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const BookDetails = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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
    document.body.classList.add("bookDetails-active");

    // Remove background image and set to white
    document.body.style.background = "white";
    document.body.style.backgroundImage = "none";
    document.body.style.overflow = "auto";
    document.body.style.display = "block";

    return () => {
      document.body.classList.remove("bookDetails-active");
      document.body.style.background = "";
      document.body.style.backgroundImage = "";
      document.body.style.overflow = "";
      document.body.style.display = "";
    };
  }, []);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`/books/${bookId}`, { auth: true });
      // Backend structure =
      // { message: "Book fetched successfully", data: bookObject }
      setBook(res.data);
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  if (loading) return <p className="loading">Loading book details...</p>;
  if (!book) return <p className="error">Book not found.</p>;

  return (
    <div className="book-details-page">
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
          <span className="logo-text">GoldenIndex</span>
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

      {/* <div className="details-header">
        <Link to="/admin/books" className="back-btn">
          ← Back to Books
        </Link>
        <h1>{book.title}</h1>
      </div> */}
      <div className="content-wrapper">
        <main className="details-main">
          <div className="details-container">
            {/* LEFT SIDE — BOOK COVER */}
            <div className="details-image">
              <img src={book.imageUrl} alt={book.title} />
            </div>

            {/* RIGHT SIDE — BOOK INFORMATION */}
            <div className="details-info">
              <h2>Book Information</h2>

              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Category:</strong> {book.category}
              </p>
              <p>
                <strong>Year:</strong> {book.year}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {book.description || "No description available."}
              </p>

              <p>
                <strong>Condition:</strong> {book.condition}
              </p>

              <p>
                <strong>Date Uploaded:</strong>{" "}
                {new Date(book.createdAt).toLocaleDateString()}
              </p>

              <h3>Availability</h3>
              <p>
                <strong>Total Copies:</strong> {book.totalCopies}
              </p>
              <p>
                <strong>Available Copies:</strong> {book.availableCopies}
              </p>
              <p>
                <strong>Borrowed Copies:</strong>{" "}
                {book.totalCopies - book.availableCopies}
              </p>
            </div>
          </div>

          {/* BORROWING HISTORY */}
          <div className="history-section">
            <h2>Borrowing History</h2>

            {(!book.borrowingHistory || book.borrowingHistory.length === 0) && (
              <p>No borrowing history for this book yet.</p>
            )}

            {book.borrowingHistory && book.borrowingHistory.length > 0 && (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Borrowed At</th>
                    <th>Due Date</th>
                    <th>Returned At</th>
                    <th>Status</th>
                    <th>Return Condition</th>
                  </tr>
                </thead>

                <tbody>
                  {book.borrowingHistory.map((record, idx) => (
                    <tr key={idx}>
                      <td>
                        {record.user?.alias || record.user?.email || "Unknown"}
                      </td>
                      <td>
                        {new Date(record.borrowedAt).toLocaleDateString()}
                      </td>
                      <td>{new Date(record.dueAt).toLocaleDateString()}</td>

                      <td>
                        {record.returnedAt
                          ? new Date(record.returnedAt).toLocaleDateString()
                          : "Not Returned"}
                      </td>

                      <td className={`status-${record.status}`}>
                        {record.status}
                      </td>

                      <td>{record.returnCondition || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookDetails;
