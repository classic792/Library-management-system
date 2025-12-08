import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";

export const getAdminStatsController = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalCopies = await Book.aggregate([
      { $group: { _id: null, copies: { $sum: "$copies" } } },
    ]);

    const borrowedBooks = await Borrow.countDocuments({ status: "borrowed" });
    const overdueBooks = await Borrow.countDocuments({ status: "overdue" });

    const totalMembers = await User.countDocuments({ role: "member" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Recent books
    const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(5);

    // Borrow history
    const recentActivity = await Borrow.find()
      .populate("book user")
      .sort({ createdAt: -1 })
      .limit(5);

    // CATEGORY DISTRIBUTION
    const categoryAgg = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Compute percent values
    const categoryDistribution = categoryAgg.map((c) => ({
      name: c._id,
      value: c.count,
      percentage: totalBooks > 0 ? Math.round((c.count / totalBooks) * 100) : 0,
    }));

    // MONTHLY BOOKS ADDED
    const monthAgg = await Book.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Convert to full 12-month array
    const monthlyData = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    months.forEach((month, index) => {
      const monthString = String(index + 1).padStart(2, "0");

      const found = monthAgg.find((m) => m._id === monthString);

      monthlyData.push({
        month,
        books: found ? found.count : 0,
      });
    });

    return res.status(200).json({
      message: "Dashboard stats loaded",
      data: {
        totalBooks,
        totalCopies: totalCopies[0]?.copies || 0,
        borrowedBooks,
        overdueBooks,
        totalMembers,
        totalAdmins,
        recentBooks,
        recentActivity,
        categoryDistribution,
        monthlyData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error loading dashboard stats",
      error: error.message,
    });
  }
};
