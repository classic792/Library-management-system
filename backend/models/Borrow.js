import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    copyId: {
      type: String,
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "returned", "overdue"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active borrows for same user-book combination
borrowSchema.index(
  { user: 1, book: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

// Compound index for efficient queries
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;
