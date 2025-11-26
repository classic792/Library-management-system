import { searchBooks, getSearchSuggestions, getAvailableCategories } from "../services/searchService.js";

const respondWithError = (res, error, fallbackMessage) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || fallbackMessage,
  });
};

export const searchBooksController = async (req, res) => {
  try {
    const searchQuery = {
      title: req.validatedQuery?.title,
      author: req.validatedQuery?.author,
      isbn: req.validatedQuery?.isbn,
      category: req.validatedQuery?.category,
      availableOnly: req.validatedQuery?.availableOnly,
    };

    const filters = {
      year: req.validatedQuery?.year,
      minYear: req.validatedQuery?.minYear,
      maxYear: req.validatedQuery?.maxYear,
    };

    const result = await searchBooks(searchQuery, filters);
    return res.status(200).json({
      message: "Search completed successfully",
      data: result,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to search books");
  }
};

export const getSearchSuggestionsController = async (req, res) => {
  try {
    const query = req.validatedQuery?.q || "";
    const suggestions = await getSearchSuggestions(query);
    return res.status(200).json({
      message: "Suggestions fetched successfully",
      data: suggestions,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch suggestions");
  }
};

export const getAvailableCategoriesController = async (req, res) => {
  try {
    const categories = await getAvailableCategories();
    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return respondWithError(res, error, "Unable to fetch categories");
  }
};

