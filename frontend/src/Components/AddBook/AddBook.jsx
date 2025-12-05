import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AddBook.css";
import "../AdminDashboard/AdminDashboard.css";
import {
  FaBook,
  FaPlus,
  FaBars,
  FaTimes,
  FaTh,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import { apiRequest } from "../../api";

const AddBook = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    year: "",
    totalCopies: "",
    imageUrl: "",
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [uploadMethod, setUploadMethod] = useState("url"); // 'url' or 'file'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      // Revoke the previous URL if any
      if (prev.imageUrl && prev.imageFile) {
        URL.revokeObjectURL(prev.imageUrl);
      }
      return prev;
    });

    if (file) {
      // Check if file is an image
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: imageUrl,
        }));
        // Clear error
        if (errors.imageUrl) {
          setErrors((prev) => ({
            ...prev,
            imageUrl: "",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "Please select a valid image file",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    // if (!formData.isbn.trim()) {
    //   newErrors.isbn = "ISBN is required";
    // }
    if (!formData.year.trim()) {
      newErrors.year = "Year is required";
    } else if (
      isNaN(formData.year) ||
      parseInt(formData.year) < 1000 ||
      parseInt(formData.year) > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Please enter a valid year";
    }
    if (!formData.totalCopies.trim()) {
      newErrors.totalCopies = "Total copies is required";
    } else if (
      isNaN(formData.totalCopies) ||
      parseInt(formData.totalCopies) < 1
    ) {
      newErrors.totalCopies = "Please enter a valid number (at least 1)";
    }
    if (!formData.availableCopies.trim()) {
      newErrors.availableCopies = "Available copies is required";
    } else if (
      isNaN(formData.availableCopies) ||
      parseInt(formData.availableCopies) < 1
    ) {
      newErrors.availableCopies = "Please enter a valid number (at least 1)";
    }

    // Image validation based on upload method
    if (uploadMethod === "url") {
      if (!formData.imageUrl.trim()) {
        newErrors.imageUrl = "Image URL is required";
      } else if (
        !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(formData.imageUrl)
      ) {
        newErrors.imageUrl = "Please enter a valid image URL";
      }
    } else {
      if (!formData.imageFile) {
        newErrors.imageUrl = "Please select an image file";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("");

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    try {
      let finalImageUrl = formData.imageUrl;

      // If file upload is selected → upload to Cloudinary
      if (uploadMethod === "file" && formData.imageFile) {
        const data = new FormData();
        data.append("file", formData.imageFile);
        data.append("upload_preset", "library_books"); // ← create preset in Cloudinary

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/db7nlurwe/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const cloudData = await res.json();
        finalImageUrl = cloudData.secure_url;
      }

      const payload = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        year: Number(formData.year),
        totalCopies: Number(formData.totalCopies),
        availableCopies: Number(formData.availableCopies),
        imageUrl: finalImageUrl || undefined,
      };

      await apiRequest("/books", {
        method: "POST",
        body: payload,
        auth: true,
      });

      setSubmitStatus("success");

      // Reset form after successful submission
      setFormData({
        title: "",
        author: "",
        category: "",
        isbn: "",
        year: "",
        totalCopies: "",
        availableCopies: "",
        imageUrl: "",
        imageFile: null,
      });
      setErrors({});

      setTimeout(() => {
        navigate("/admin/books");
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error adding book:", error);
      // You could also set a specific error message here if needed
    }
  };

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

  useEffect(() => {
    document.body.classList.add("dashboard-active");
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

  return (
    <div className="add-book-page">
      {/* Header */}
      <header className="add-book-header">
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
        <nav className="add-book-nav">
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
      <main className="add-book-main">
        <div className="add-book-title-section">
          <h1 className="add-book-title">Add Book</h1>
          <p className="add-book-subtitle">Add a new book to your library</p>
        </div>

        <div className="add-book-form-container">
          <form className="add-book-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? "error" : ""}
                  placeholder="Enter book title"
                />
                {errors.title && (
                  <span className="error-message">{errors.title}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={errors.author ? "error" : ""}
                  placeholder="Enter author name"
                />
                {errors.author && (
                  <span className="error-message">{errors.author}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? "error" : ""}
                  placeholder="e.g., Fiction, Science, History"
                />
                {errors.category && (
                  <span className="error-message">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={errors.year ? "error" : ""}
                  placeholder="e.g., 2024"
                  min="1000"
                  max={new Date().getFullYear() + 1}
                />
                {errors.year && (
                  <span className="error-message">{errors.year}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalCopies">Total Copies *</label>
                <input
                  type="number"
                  id="totalCopies"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  className={errors.totalCopies ? "error" : ""}
                  placeholder="Enter number total of copies"
                  min="1"
                />
                {errors.totalCopies && (
                  <span className="error-message">{errors.totalCopies}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="availableCopies">Available Copies *</label>
                <input
                  type="number"
                  id="availableCopies"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  className={errors.availableCopies ? "error" : ""}
                  placeholder="Enter number available of copies"
                  min="1"
                />
                {errors.availableCopies && (
                  <span className="error-message">
                    {errors.availableCopies}
                  </span>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="form-group full-width">
              <label>Book Cover Image *</label>

              {/* Toggle between URL and File Upload */}
              <div className="upload-method-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${
                    uploadMethod === "url" ? "active" : ""
                  }`}
                  onClick={() => {
                    setUploadMethod("url");
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: null,
                      imageUrl: "",
                    }));
                    setErrors((prev) => ({ ...prev, imageUrl: "" }));
                  }}>
                  Enter URL
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${
                    uploadMethod === "file" ? "active" : ""
                  }`}
                  onClick={() => {
                    setUploadMethod("file");
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: "",
                      imageFile: null,
                    }));
                    setErrors((prev) => ({ ...prev, imageUrl: "" }));
                  }}>
                  <FaUpload /> Upload File
                </button>
              </div>

              {/* URL Input */}
              {uploadMethod === "url" && (
                <div className="upload-section">
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className={errors.imageUrl ? "error" : ""}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === "file" && (
                <div className="upload-section">
                  <input
                    type="file"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={errors.imageUrl ? "error" : ""}
                  />
                  <p className="upload-hint">Accepts: JPG, PNG, WEBP,JPEG</p>
                </div>
              )}

              {errors.imageUrl && (
                <span className="error-message">{errors.imageUrl}</span>
              )}

              {/* Image Preview */}
              {formData.imageUrl && !errors.imageUrl && (
                <div className="image-preview">
                  <img
                    src={formData.imageUrl}
                    alt="Book cover preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <p className="preview-error" style={{ display: "none" }}>
                    Unable to load image
                  </p>
                </div>
              )}
            </div>

            {submitStatus && (
              <div className={`submit-message ${submitStatus}`}>
                {submitStatus === "success"
                  ? "✓ Book added successfully!"
                  : submitStatus === "error"
                  ? "✗ Error adding book. Please check all fields and try again."
                  : ""}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add Book
              </button>
              <button
                type="button"
                className="reset-btn"
                onClick={() => {
                  setFormData({
                    title: "",
                    author: "",
                    category: "",
                    isbn: "",
                    year: "",
                    totalCopies: "",
                    availableCopies: "",
                    imageUrl: "",
                    imageFile: null,
                  });
                  setErrors({});
                  setSubmitStatus("");
                }}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddBook;
