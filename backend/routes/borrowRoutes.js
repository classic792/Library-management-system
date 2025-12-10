import express from "express";
import {
  getUserBorrowsController,
  getBookBorrowsController,
  getAllBorrowsController,
  getBorrowController,
  updateBorrowStatusController,
  checkOverdueBorrowsController,
} from "../controllers/borrowController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "../middleware/validationMiddleware.js";
import { borrowIdParamSchema, bookIdParamSchema } from "../utils/validators.js";
import Joi from "joi";

const router = express.Router();

router.use(authenticate);

// User's own borrows
router.get(
  "/my-borrows",
  validateQuery(
    Joi.object({
      status: Joi.string().valid("active", "returned", "overdue").optional(),
    })
  ),
  getUserBorrowsController
);

// All borrows (admin/librarian only)
router.get(
  "/",
  authorizeRoles("admin", "librarian"),
  validateQuery(
    Joi.object({
      status: Joi.string().valid("active", "returned", "overdue").optional(),
    })
  ),
  getAllBorrowsController
);

// Book-specific borrows
router.get(
  "/book/:bookId",
  authorizeRoles("admin", "librarian"),
  validateParams(bookIdParamSchema),
  validateQuery(
    Joi.object({
      status: Joi.string().valid("active", "returned", "overdue").optional(),
    })
  ),
  getBookBorrowsController
);

// Single borrow
router.get(
  "/:borrowId",
  validateParams(borrowIdParamSchema),
  getBorrowController
);

// Update borrow status (admin/librarian only)
router.patch(
  "/:borrowId/status",
  authorizeRoles("admin", "librarian"),
  validateParams(borrowIdParamSchema),
  validate(
    Joi.object({
      status: Joi.string().valid("active", "returned", "overdue").required(),
    })
  ),
  updateBorrowStatusController
);

// Check overdue borrows (admin only)
router.post(
  "/check-overdue",
  authorizeRoles("admin"),
  checkOverdueBorrowsController
);

export default router;
