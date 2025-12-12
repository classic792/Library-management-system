// import mongoose from "mongoose";
// import Book from "./models/Book.js";
// import User from "./models/User.js";
// import dotenv from "dotenv";

// dotenv.config();

// const runDebug = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Connected to MongoDB");

//     // Get all books and check borrowing history
//     const books = await Book.find().limit(5);

//     books.forEach((book) => {
//       console.log(`Checking Book: ${book.title} (${book._id})`);
//       if (book.borrowingHistory.length > 0) {
//         console.log(
//           "Borrowing History:",
//           JSON.stringify(book.borrowingHistory, null, 2)
//         );
//       } else {
//         console.log("No borrowing history.");
//       }
//     });
//   } catch (error) {
//     console.error("Debug Failed:", error);
//   } finally {
//     await mongoose.disconnect();
//   }
// };

// runDebug();
