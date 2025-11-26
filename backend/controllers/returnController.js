import {
  getUserReturns,
  getBookReturns,
  getAllReturns,
  getReturnById,
} from "../services/returnService.js";

const respondWithError = (res, error, fallbackMessage) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || fallbackMessage,
  });
};

export const getUserReturnsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const returns = await getUserReturns(userId);
    return res.status(200).json({
      message: "Returns fetched successfully",
      data: returns,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch returns");
  }
};

export const getBookReturnsController = async (req, res) => {
  try {
    const returns = await getBookReturns(req.validatedParams.bookId);
    return res.status(200).json({
      message: "Book returns fetched successfully",
      data: returns,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch book returns");
  }
};

export const getAllReturnsController = async (req, res) => {
  try {
    const returns = await getAllReturns();
    return res.status(200).json({
      message: "All returns fetched successfully",
      data: returns,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch returns");
  }
};

export const getReturnController = async (req, res) => {
  try {
    const returnRecord = await getReturnById(req.validatedParams.returnId);
    return res.status(200).json({
      message: "Return fetched successfully",
      data: returnRecord,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch return");
  }
};

