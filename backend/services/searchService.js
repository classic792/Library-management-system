import Book from "../models/Book.js";

export const searchBooks = async (query, filters = {}) => {
  const { title, author, isbn, category, availableOnly } = query;

  // Build search query
  const searchQuery = {};

  // Text search conditions (case-insensitive, partial match)
  const orConditions = [];

  if (title) {
    orConditions.push({
      title: { $regex: title.trim(), $options: "i" },
    });
  }

  if (author) {
    orConditions.push({
      author: { $regex: author.trim(), $options: "i" },
    });
  }

  if (isbn) {
    orConditions.push({
      isbn: { $regex: isbn.trim(), $options: "i" },
    });
  }

  if (category) {
    orConditions.push({
      category: { $regex: category.trim(), $options: "i" },
    });
  }

  // If no search terms provided, return all books (with filters applied)
  if (orConditions.length > 0) {
    searchQuery.$or = orConditions;
  }

  // Apply additional filters
  if (filters.year) {
    searchQuery.year = filters.year;
  }

  if (filters.minYear) {
    searchQuery.year = { ...searchQuery.year, $gte: filters.minYear };
  }

  if (filters.maxYear) {
    searchQuery.year = { ...searchQuery.year, $lte: filters.maxYear };
  }

  if (availableOnly === true || availableOnly === "true") {
    searchQuery.availableCopies = { $gt: 0 };
  }

  // Execute search
  const books = await Book.find(searchQuery).sort({ createdAt: -1 });

  return {
    results: books,
    count: books.length,
    query: {
      searchTerms: { title, author, isbn, category },
      filters,
    },
  };
};

export const getSearchSuggestions = async (query) => {
  if (!query || query.trim().length < 2) {
    return {
      titles: [],
      authors: [],
      categories: [],
      isbns: [],
    };
  }

  const searchTerm = query.trim();
  const regex = new RegExp(searchTerm, "i");

  // Get distinct values for suggestions
  const [titles, authors, categories, isbns] = await Promise.all([
    Book.distinct("title", { title: regex }).limit(10),
    Book.distinct("author", { author: regex }).limit(10),
    Book.distinct("category", { category: regex }).limit(10),
    Book.distinct("isbn", { isbn: regex }).limit(10),
  ]);

  return {
    titles,
    authors,
    categories,
    isbns,
  };
};

export const getAvailableCategories = async () => {
  const categories = await Book.distinct("category");
  return categories.sort();
};

