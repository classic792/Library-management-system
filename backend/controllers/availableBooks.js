import Book from "../models/Book.js";


export const getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ availableCopies: { $gt: 0 } });

    res.set("Cache-Control", "no-store");
    res.status(200).json({ books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};
