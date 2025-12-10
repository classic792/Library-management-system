// import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import User from "../models/User.js";

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get user
    const user = await User.findById(req.user.id).select("alias");
    console.log("Decoded user from token:", req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found in database",
        userIdReceived: userId,
      });
    }

    console.log("User found:", user.alias);
    // Borrowed Books Currently
    const borrowedCount = await Borrow.countDocuments({
      user: userId,
      status: { $in: ["borrowed", "active"] },
    });

    // Reserved Books
    const reservedCount = await Borrow.countDocuments({
      user: userId,
      status: { $in: ["reserved", "pending"] },
    });

    // Returned Books
    const returnedCount = await Borrow.countDocuments({
      user: userId,
      status: "returned",
    });

    // Recent Activity (Last 5)
    const recentActivityRaw = await Borrow.find({ user: userId })
      .populate("book", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = recentActivityRaw.map((record) => ({
      title: record.book?.title || "Unknown Book",
      action:
        record.status.charAt(0).toUpperCase() +
        record.status.slice(1).toLowerCase(),
      date: record.createdAt.toDateString(),
    }));

    res.json({
      name: user?.alias || "User",
      stats: {
        borrowedBooks: borrowedCount,
        reservedBooks: reservedCount,
        returnedBooks: returnedCount,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("User Dashboard Error:", error);
    res.status(500).json({ message: "Server error - loading dashboard" });
  }
};
