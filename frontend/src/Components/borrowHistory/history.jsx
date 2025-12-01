import "./history.css";

const BorrowHistory = () => {
    const history = [
        { id: 1, book: "Atomic Habits", dateBorrowed: "2025-01-02", returned: true },
        { id: 2, book: "Clean Code", dateBorrowed: "2025-01-10", returned: false },
        { id: 3, book: "Rich Dad Poor Dad", dateBorrowed: "2025-01-12", returned: true },
    ];

    return (
        <div className="history-container">
            <h2>Borrow History</h2>

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
                                    <span className={`status-badge ${item.returned ? "returned" : "not-returned"}`}>
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
                            <p><strong>Book:</strong> {item.book}</p>
                            <p><strong>Date:</strong> {item.dateBorrowed}</p>
                            <p>
                                <strong>Status:</strong>
                                <span className={`status-badge ${item.returned ? "returned" : "not-returned"}`}>
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
