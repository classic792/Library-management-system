import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AddBook.css";
import { FaBook, FaPlus, FaBars, FaTimes, FaTh } from "react-icons/fa";

const AddBook = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        isbn: '',
        year: '',
        totalCopies: '',
        imageUrl: ''
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.author.trim()) {
            newErrors.author = 'Author is required';
        }
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }
        if (!formData.isbn.trim()) {
            newErrors.isbn = 'ISBN is required';
        }
        if (!formData.year.trim()) {
            newErrors.year = 'Year is required';
        } else if (isNaN(formData.year) || parseInt(formData.year) < 1000 || parseInt(formData.year) > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }
        if (!formData.totalCopies.trim()) {
            newErrors.totalCopies = 'Total copies is required';
        } else if (isNaN(formData.totalCopies) || parseInt(formData.totalCopies) < 1) {
            newErrors.totalCopies = 'Please enter a valid number (at least 1)';
        }
        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
        } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid image URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitStatus('');
        
        if (validateForm()) {
            // Here you would typically send the data to your API
            console.log('Form data:', formData);
            setSubmitStatus('success');
            
            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    title: '',
                    author: '',
                    category: '',
                    isbn: '',
                    year: '',
                    totalCopies: '',
                    imageUrl: ''
                });
                setSubmitStatus('');
            }, 2000);
        } else {
            setSubmitStatus('error');
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
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
        <div className="add-book-page">
            {/* Header */}
            <header className="add-book-header">
                <Link to="/admin/dashboard" className="logo-container" style={{ textDecoration: 'none' }}>
                    <div className="logo-icon">
                        <div className="logo-line logo-line-1"></div>
                        <div className="logo-line logo-line-2"></div>
                        <div className="logo-line logo-line-3"></div>
                    </div>
                    <span className="logo-text">LibraSystem</span>
                </Link>
                <nav className="add-book-nav">
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
                                    className={errors.title ? 'error' : ''}
                                    placeholder="Enter book title"
                                />
                                {errors.title && <span className="error-message">{errors.title}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="author">Author *</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className={errors.author ? 'error' : ''}
                                    placeholder="Enter author name"
                                />
                                {errors.author && <span className="error-message">{errors.author}</span>}
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
                                    className={errors.category ? 'error' : ''}
                                    placeholder="e.g., Fiction, Science, History"
                                />
                                {errors.category && <span className="error-message">{errors.category}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="isbn">ISBN *</label>
                                <input
                                    type="text"
                                    id="isbn"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    className={errors.isbn ? 'error' : ''}
                                    placeholder="Enter ISBN number"
                                />
                                {errors.isbn && <span className="error-message">{errors.isbn}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="year">Year *</label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className={errors.year ? 'error' : ''}
                                    placeholder="e.g., 2024"
                                    min="1000"
                                    max={new Date().getFullYear() + 1}
                                />
                                {errors.year && <span className="error-message">{errors.year}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="totalCopies">Total Copies *</label>
                                <input
                                    type="number"
                                    id="totalCopies"
                                    name="totalCopies"
                                    value={formData.totalCopies}
                                    onChange={handleChange}
                                    className={errors.totalCopies ? 'error' : ''}
                                    placeholder="Enter number of copies"
                                    min="1"
                                />
                                {errors.totalCopies && <span className="error-message">{errors.totalCopies}</span>}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="imageUrl">Image URL *</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className={errors.imageUrl ? 'error' : ''}
                                placeholder="https://example.com/book-cover.jpg"
                            />
                            {errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
                            {formData.imageUrl && !errors.imageUrl && (
                                <div className="image-preview">
                                    <img src={formData.imageUrl} alt="Book cover preview" onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }} />
                                    <p className="preview-error" style={{ display: 'none' }}>Unable to load image</p>
                                </div>
                            )}
                        </div>

                        {submitStatus && (
                            <div className={`submit-message ${submitStatus}`}>
                                {submitStatus === 'success' 
                                    ? '✓ Book added successfully!' 
                                    : 'All feild is required'}
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
                                        title: '',
                                        author: '',
                                        category: '',
                                        isbn: '',
                                        year: '',
                                        totalCopies: '',
                                        imageUrl: ''
                                    });
                                    setErrors({});
                                    setSubmitStatus('');
                                }}
                            >
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
