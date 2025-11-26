import Book from "../models/Book.js";

const throwHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const trimStringFields = (payload) => {
  const result = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (typeof value === "string") {
      result[key] = value.trim();
    } else {
      result[key] = value;
    }
  });
  return result;
};

export const createBook = async (payload) => {
  const normalizedPayload = trimStringFields(payload);

  const existing = await Book.findOne({ isbn: normalizedPayload.isbn });
  if (existing) {
    throwHttpError("A book with this ISBN already exists", 409);
  }
  const book = await Book.create(normalizedPayload);
  return book;
};

export const getAllBooks = async () => {
  return Book.find().sort({ createdAt: -1 });
};

export const getBookById = async (bookId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }
  return book;
};

export const updateBookById = async (bookId, updates) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }

  const normalizedUpdates = trimStringFields(updates);
  Object.assign(book, normalizedUpdates);

  await book.save();
  return book;
};

export const deleteBookById = async (bookId) => {
  const book = await Book.findByIdAndDelete(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }
  return book;
};

export const borrowBook = async (bookId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }

  if (book.availableCopies <= 0) {
    throwHttpError("No copies available to borrow", 400);
  }

  book.borrowCopy();
  await book.save();
  return book;
};

export const returnBook = async (bookId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }

  if (book.availableCopies >= book.totalCopies) {
    throwHttpError("All copies are already returned", 400);
  }

  book.returnCopy();
  await book.save();
  return book;
};
