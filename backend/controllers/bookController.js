import {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} from "../services/bookService.js";
import { createBorrow } from "../services/borrowService.js";
import { createReturn } from "../services/returnService.js";

const respondWithError = (res, error, fallbackMessage) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || fallbackMessage,
  });
};

export const createBookController = async (req, res) => {
  try {
    const book = await createBook(req.validatedData);
    return res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to create book");
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
    return respondWithError(res, error, "Unable to fetch books");
  }
};

export const getBookController = async (req, res) => {
  try {
    const book = await getBookById(req.validatedParams.bookId);
    return res.status(200).json({
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch the book");
  }
};

export const updateBookController = async (req, res) => {
  try {
    const book = await updateBookById(req.validatedParams.bookId, req.validatedData);
    return res.status(200).json({
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to update the book");
  }
};

export const deleteBookController = async (req, res) => {
  try {
    await deleteBookById(req.validatedParams.bookId);
    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to delete the book");
  }
};

export const borrowBookController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dueDateDays } = req.validatedData || {};
    const borrow = await createBorrow(userId, req.validatedParams.bookId, dueDateDays);
    return res.status(201).json({
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to borrow the book");
  }
};

export const returnBookController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { condition, fine } = req.validatedData || {};
    const returnRecord = await createReturn(userId, req.validatedParams.bookId, condition, fine);
    return res.status(201).json({
      message: "Book returned successfully",
      data: returnRecord,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to return the book");
  }
};
