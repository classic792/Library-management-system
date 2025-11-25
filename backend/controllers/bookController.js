import {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} from "../services/bookService.js";

export const createBookController = async (req, res) => {
  try {
    const book = await createBook(req.body);
    return res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Unable to create book(error in createBookController)",
    });
  }
};
export const getBooksController = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json({
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Unable to fetch books(error in getBooksController)",
    });
  }
};

export const getBookController = async (req, res) => {
  try {
    const book = await getBookById(req.params.bookId);
    return res.status(200).json({
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Unable to fetch the book(error in getBookController)",
    });
  }
};

export const updateBookController = async (req, res) => {
  try {
    const book = await updateBookById(req.params.bookId, req.body);
    return res.status(200).json({
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        "Unable to update the book(error in updateBookController)",
    });
  }
};

export const deleteBookController = async (req, res) => {
  try {
    await deleteBookById(req.params.bookId);
    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        "Unable to delete the book(error in deleteBookController)",
    });
  }
};
