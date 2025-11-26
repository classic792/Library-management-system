import {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  borrowBook,
  returnBook,
} from "../services/bookService.js";
import {
  bookCreateSchema,
  bookUpdateSchema,
} from "../utils/validators.js";

const respondWithError = (res, error, fallbackMessage) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || fallbackMessage,
  });
};

const validatePayload = (schema, payload) => {
  const { error, value } = schema.validate(payload, { abortEarly: false });
  if (error) {
    const validationError = new Error(
      error.details.map((detail) => detail.message).join(", ")
    );
    validationError.statusCode = 400;
    throw validationError;
  }
  return value;
};

export const createBookController = async (req, res) => {
  try {
    const validatedData = validatePayload(bookCreateSchema, req.body);
    const book = await createBook(validatedData);
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
    const book = await getBookById(req.params.bookId);
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
    const validatedData = validatePayload(bookUpdateSchema, req.body);
    const book = await updateBookById(req.params.bookId, validatedData);
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
    await deleteBookById(req.params.bookId);
    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to delete the book");
  }
};

export const borrowBookController = async (req, res) => {
  try {
    const book = await borrowBook(req.params.bookId);
    return res.status(200).json({
      message: "Book borrowed successfully",
      data: book,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to borrow the book");
  }
};

export const returnBookController = async (req, res) => {
  try {
    const book = await returnBook(req.params.bookId);
    return res.status(200).json({
      message: "Book returned successfully",
      data: book,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to return the book");
  }
};
