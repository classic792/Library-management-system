import "./availableBooks.css";

const Books = () => {
    const books = [
        { id: 1, title: "Atomic Habits", author: "James Clear", available: true },
        { id: 2, title: "Clean Code", author: "Robert C. Martin", available: false },
        { id: 3, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", available: true },
    ];

    return (
        <div className="books-page">
            <h2>Available Books</h2>

            <div className="books-grid">
                {books.map((book) => (
                    <div className="book-card" key={book.id}>
                        <h3>{book.title}</h3>
                        <p className="author">by {book.author}</p>

                        <span className={`status ${book.available ? "available" : "unavailable"}`}>
                            {book.available ? "Available" : "Borrowed"}
                        </span>

                        {book.available ? (
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

export default Books;
