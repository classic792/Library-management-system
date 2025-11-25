import express from "express";
import {
  createBookController,
  getBooksController,
  getBookController,
  updateBookController,
  deleteBookController,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/", createBookController);
router.get("/", getBooksController);
router.get("/:bookId", getBookController);
router.patch("/:bookId", updateBookController);
router.delete("/:bookId", deleteBookController);

export default router;

