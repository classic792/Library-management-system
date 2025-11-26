import Return from "../models/Return.js";
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import { returnBook } from "./bookService.js";

const throwHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const createReturn = async (userId, bookId, condition = "good", fine = 0) => {
  // Find active borrow for this user and book
  const borrow = await Borrow.findOne({
    user: userId,
    book: bookId,
    status: { $in: ["active", "overdue"] },
  });

  if (!borrow) {
    throwHttpError("No active borrow found for this book", 404);
  }

  // Check if return already exists
  const existingReturn = await Return.findOne({ borrow: borrow._id });
  if (existingReturn) {
    throwHttpError("This book has already been returned", 409);
  }

  // Validate condition
  if (!["good", "damaged", "lost"].includes(condition)) {
    throwHttpError("Invalid condition. Must be: good, damaged, or lost", 400);
  }

  // Validate fine
  if (fine < 0) {
    throwHttpError("Fine cannot be negative", 400);
  }

  // Create return record
  const returnRecord = await Return.create({
    borrow: borrow._id,
    user: userId,
    book: bookId,
    condition,
    fine,
  });

  // Update borrow status
  borrow.status = "returned";
  borrow.returnDate = new Date();
  await borrow.save();

  // Update book available copies
  await returnBook(bookId);

  // Populate and return
  await returnRecord.populate("user", "name email alias");
  await returnRecord.populate("book", "title author isbn");
  await returnRecord.populate({
    path: "borrow",
    select: "borrowDate dueDate",
  });

  return returnRecord;
};

export const getUserReturns = async (userId) => {
  return Return.find({ user: userId })
    .populate("book", "title author isbn imageUrl")
    .populate({
      path: "borrow",
      select: "borrowDate dueDate",
    })
    .sort({ returnDate: -1 });
};

export const getBookReturns = async (bookId) => {
  return Return.find({ book: bookId })
    .populate("user", "name email alias")
    .populate({
      path: "borrow",
      select: "borrowDate dueDate",
    })
    .sort({ returnDate: -1 });
};

export const getAllReturns = async () => {
  return Return.find()
    .populate("user", "name email alias")
    .populate("book", "title author isbn")
    .populate({
      path: "borrow",
      select: "borrowDate dueDate",
    })
    .sort({ returnDate: -1 });
};

export const getReturnById = async (returnId) => {
  const returnRecord = await Return.findById(returnId)
    .populate("user", "name email alias")
    .populate("book", "title author isbn imageUrl")
    .populate({
      path: "borrow",
      select: "borrowDate dueDate",
    });

  if (!returnRecord) {
    throwHttpError("Return record not found", 404);
  }

  return returnRecord;
};

