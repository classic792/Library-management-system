import express from "express";
import {
  getUserReturnsController,
  getBookReturnsController,
  getAllReturnsController,
  getReturnController,
} from "../controllers/returnController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { validateParams } from "../middleware/validationMiddleware.js";
import {
  returnIdParamSchema,
  bookIdParamSchema,
} from "../utils/validators.js";

const router = express.Router();

router.use(authenticate);

// User's own returns
router.get("/my-returns", getUserReturnsController);

// All returns (admin/librarian only)
router.get(
  "/",
  authorizeRoles("admin", "librarian"),
  getAllReturnsController
);

// Book-specific returns
router.get(
  "/book/:bookId",
  authorizeRoles("admin", "librarian"),
  validateParams(bookIdParamSchema),
  getBookReturnsController
);

// Single return
router.get(
  "/:returnId",
  validateParams(returnIdParamSchema),
  getReturnController
);

export default router;

