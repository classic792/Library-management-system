import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import { borrowBook } from "./bookService.js";

const throwHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const DEFAULT_BORROW_DAYS = 14;

export const createBorrow = async (
  userId,
  bookId,
  dueDateDays = DEFAULT_BORROW_DAYS
) => {
  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throwHttpError("Book not found", 404);
  }

  // Check if user already has an active borrow for this book
  const existingBorrow = await Borrow.findOne({
    user: userId,
    book: bookId,
    status: "active",
  });

  if (existingBorrow) {
    throwHttpError("You already have an active borrow for this book", 409);
  }

  // Check if copies are available
  if (book.availableCopies <= 0) {
    throwHttpError("No copies available to borrow", 400);
  }

  // Calculate due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + dueDateDays);

  // Update book available copies and history
  // We must do this first to get the copyId, as it is required for the Borrow record
  const { copyId } = await borrowBook(bookId, userId, dueDate);

  // Create borrow record
  const borrow = await Borrow.create({
    user: userId,
    book: bookId,
    dueDate,
    copyId,
  });

  // Populate and return
  await borrow.populate("user", "name email alias");
  await borrow.populate("book", "title author isbn");

  return borrow;
};

export const getUserBorrows = async (userId, status = null) => {
  const query = { user: userId };
  if (status) {
    query.status = status;
  }

  return Borrow.find(query)
    .populate("book", "title author isbn imageUrl")
    .sort({ borrowDate: -1 });
};

export const getBookBorrows = async (bookId, status = null) => {
  const query = { book: bookId };
  if (status) {
    query.status = status;
  }

  return Borrow.find(query)
    .populate("user", "name email alias")
    .sort({ borrowDate: -1 });
};

export const getAllBorrows = async (status = null) => {
  const query = status ? { status } : {};
  return Borrow.find(query)
    .populate("user", "name email alias")
    .populate("book", "title author isbn")
    .sort({ borrowDate: -1 });
};

export const getBorrowById = async (borrowId) => {
  const borrow = await Borrow.findById(borrowId)
    .populate("user", "name email alias")
    .populate("book", "title author isbn imageUrl");

  if (!borrow) {
    throwHttpError("Borrow record not found", 404);
  }

  return borrow;
};

export const updateBorrowStatus = async (borrowId, status) => {
  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    throwHttpError("Borrow record not found", 404);
  }

  if (!["active", "returned", "overdue"].includes(status)) {
    throwHttpError("Invalid status", 400);
  }

  borrow.status = status;
  if (status === "returned" && !borrow.returnDate) {
    borrow.returnDate = new Date();
  }

  await borrow.save();
  return borrow;
};

// Check and update overdue borrows
export const checkOverdueBorrows = async () => {
  const now = new Date();
  const overdueBorrows = await Borrow.updateMany(
    {
      status: "active",
      dueDate: { $lt: now },
    },
    {
      $set: { status: "overdue" },
    }
  );

  return overdueBorrows;
};
