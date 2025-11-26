import express from "express";
import {
  createBookController,
  getBooksController,
  getBookController,
  updateBookController,
  deleteBookController,
  borrowBookController,
  returnBookController,
} from "../controllers/bookController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  validate,
  validateParams,
} from "../middleware/validationMiddleware.js";
import {
  bookCreateSchema,
  bookUpdateSchema,
  bookIdParamSchema,
  borrowCreateSchema,
  returnCreateSchema,
} from "../utils/validators.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin", "librarian"),
  validate(bookCreateSchema),
  createBookController
);
router.get(
  "/",
  authorizeRoles("admin", "librarian", "member"),
  getBooksController
);
router.get(
  "/:bookId",
  authorizeRoles("admin", "librarian", "member"),
  validateParams(bookIdParamSchema),
  getBookController
);
router.patch(
  "/:bookId",
  authorizeRoles("admin", "librarian"),
  validateParams(bookIdParamSchema),
  validate(bookUpdateSchema),
  updateBookController
);
router.delete(
  "/:bookId",
  authorizeRoles("admin"),
  validateParams(bookIdParamSchema),
  deleteBookController
);
router.post(
  "/:bookId/borrow",
  authorizeRoles("admin", "librarian", "member"),
  validateParams(bookIdParamSchema),
  validate(borrowCreateSchema),
  borrowBookController
);
router.post(
  "/:bookId/return",
  authorizeRoles("admin", "librarian", "member"),
  validateParams(bookIdParamSchema),
  validate(returnCreateSchema),
  returnBookController
);
export default router;
