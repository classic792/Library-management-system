import express from "express";
import {
  searchBooksController,
  getSearchSuggestionsController,
  getAvailableCategoriesController,
} from "../controllers/searchController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { validateQuery } from "../middleware/validationMiddleware.js";
import {
  searchQuerySchema,
  searchSuggestionQuerySchema,
} from "../utils/validators.js";

const router = express.Router();

router.use(authenticate);

// Main search endpoint - search by title, author, ISBN, or category
router.get(
  "/",
  authorizeRoles("admin", "librarian", "member"),
  validateQuery(searchQuerySchema),
  searchBooksController
);

// Get search suggestions for autocomplete
router.get(
  "/suggestions",
  authorizeRoles("admin", "librarian", "member"),
  validateQuery(searchSuggestionQuerySchema),
  getSearchSuggestionsController
);

// Get all available categories
router.get(
  "/categories",
  authorizeRoles("admin", "librarian", "member"),
  getAvailableCategoriesController
);

export default router;

