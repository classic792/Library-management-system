import {
  getUserBorrows,
  getBookBorrows,
  getAllBorrows,
  getBorrowById,
  updateBorrowStatus,
  checkOverdueBorrows,
} from "../services/borrowService.js";

const respondWithError = (res, error, fallbackMessage) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || fallbackMessage,
  });
};

export const getUserBorrowsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const status = req.validatedQuery?.status || null;
    const borrows = await getUserBorrows(userId, status);
    return res.status(200).json({
      message: "Borrows fetched successfully",
      data: borrows,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch borrows");
  }
};

export const getBookBorrowsController = async (req, res) => {
  try {
    const borrows = await getBookBorrows(req.validatedParams.bookId, req.validatedQuery?.status);
    return res.status(200).json({
      message: "Book borrows fetched successfully",
      data: borrows,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch book borrows");
  }
};

export const getAllBorrowsController = async (req, res) => {
  try {
    const status = req.validatedQuery?.status || null;
    const borrows = await getAllBorrows(status);
    return res.status(200).json({
      message: "All borrows fetched successfully",
      data: borrows,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch borrows");
  }
};

export const getBorrowController = async (req, res) => {
  try {
    const borrow = await getBorrowById(req.validatedParams.borrowId);
    return res.status(200).json({
      message: "Borrow fetched successfully",
      data: borrow,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch borrow");
  }
};

export const updateBorrowStatusController = async (req, res) => {
  try {
    const { status } = req.validatedData;
    const borrow = await updateBorrowStatus(req.validatedParams.borrowId, status);
    return res.status(200).json({
      message: "Borrow status updated successfully",
      data: borrow,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to update borrow status");
  }
};

export const checkOverdueBorrowsController = async (req, res) => {
  try {
    const result = await checkOverdueBorrows();
    return res.status(200).json({
      message: "Overdue borrows checked successfully",
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to check overdue borrows");
  }
};

