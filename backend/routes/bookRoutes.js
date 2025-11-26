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

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorizeRoles("admin", "librarian"),
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
  getBookController
);
router.patch(
  "/:bookId",
  authorizeRoles("admin", "librarian"),
  updateBookController
);
router.delete(
  "/:bookId",
  authorizeRoles("admin"),
  deleteBookController
);
router.post(
  "/:bookId/borrow",
  authorizeRoles("admin", "librarian", "member"),
  borrowBookController
);
router.post(
  "/:bookId/return",
  authorizeRoles("admin", "librarian", "member"),
  returnBookController
);

export default router;

