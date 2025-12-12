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

  const { isbn, title, author } = normalizedPayload;

  let existing = null;

  // If ISBN is provided → check by ISBN first
  if (isbn && isbn.trim() !== "") {
    existing = await Book.findOne({ isbn });
  }

  // If no ISBN match → fallback to title + author
  if (!existing) {
    existing = await Book.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
      author: { $regex: `^${author}$`, $options: "i" },
    });
  }
  // If book exists → merge copies
  if (existing) {
    const copiesToAdd = normalizedPayload.totalCopies || 1;

    existing.incrementCopies(copiesToAdd);
    await existing.save();

    return {
      ...existing.toObject(),
      merged: true,
      message: "Existing book updated with additional copies",
    };
  }

  // Otherwise create a new book
  const book = await Book.create(normalizedPayload);
  return book;
};

export const getAllBooks = async () => {
  return Book.find().sort({ createdAt: -1 });
};

export const getBookById = async (bookId) => {
  const book = await Book.findById(bookId).populate(
    "borrowingHistory.user",
    "firstName lastName email alias"
  );
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

export const borrowBook = async (bookId, userId, dueDate) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }

  if (book.availableCopies <= 0) {
    throwHttpError("No copies available to borrow", 400);
  }

  const copyId = book.borrowCopy();

  // Add to borrowing history
  book.borrowingHistory.push({
    user: userId,
    copyId: copyId,
    borrowedAt: new Date(),
    dueAt: dueDate,
    status: "borrowed",
  });

  await book.save();
  return { book, copyId };
};

export const returnBook = async (bookId, copyId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }

  // If we are strictly using copyId, we should leverage it.
  // But for safety, we keep the original check if we want to ensure basic consistency,
  // though specific copy return logic is safer.

  book.returnCopy(copyId);
  await book.save();
  return book;
};
