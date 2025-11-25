import Book from "../models/Book.js";

const throwHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const createBook = async (payload) => {
  const normalizedPayload = {
    ...payload,
    title: payload.title?.trim(),
    author: payload.author?.trim(),
    category: payload.category?.trim(),
    isbn: payload.isbn?.trim(),
    imageUrl: payload.imageUrl?.trim(),
  };

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

  const fields = [
    "title",
    "author",
    "category",
    "isbn",
    "year",
    "totalCopies",
    "availableCopies",
    "imageUrl",
  ];

  fields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (typeof updates[field] === "string") {
        book[field] = updates[field].trim();
      } else {
        book[field] = updates[field];
      }
    }
  });

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
