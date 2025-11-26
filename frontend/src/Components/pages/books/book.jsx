import "./book.css";

const Books = () => {
  return (
    <div className="books">
      <h2>Books Collection</h2>

      <table className="books-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>The Great Gatsby</td>
            <td>F. Scott Fitzgerald</td>
            <td>Available</td>
          </tr>

          <tr>
            <td>Atomic Habits</td>
            <td>James Clear</td>
            <td>Borrowed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Books;
