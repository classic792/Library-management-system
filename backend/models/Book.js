import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Worn", "Damaged"],
      default: "Good",
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: 13,
    },
    year: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 0,
    },
    availableCopies: {
      type: Number,
      min: 0,
    },
    copies: [
      {
        copyId: {
          type: String,
          required: true,
          unique: true,
          sparse: true, // Allow nulls if needed, but usually unique
        },
        status: {
          type: String,
          enum: ["available", "borrowed", "lost", "damaged"],
          default: "available",
        },
      },
    ],
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    borrowingHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        copyId: String, // Store which copy was borrowed
        borrowedAt: Date,
        dueAt: Date,
        returnedAt: Date,
        returnCondition: {
          type: String,
          enum: ["Good", "Fair", "Damaged"],
        },
        status: {
          type: String,
          enum: ["borrowed", "returned", "overdue"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", function normalizeCopies(next) {
  if (this.availableCopies == null) {
    this.availableCopies = this.totalCopies;
  }
  // Auto-generate copies if missing (backward compatibility or new books)
  if (this.copies.length === 0 && this.totalCopies > 0) {
    for (let i = 1; i <= this.totalCopies; i++) {
      // Use ISBN if available, otherwise fallback to _id or random string
      const baseId = this.isbn || "BOOK";
      this.copies.push({
        copyId: `${baseId}-${i}`,
        status: "available",
      });
    }
  }

  // Sync availableCopies with actual count of 'available' in copies array
  // This ensures truth is derived from the specific copies.
  if (this.copies.length > 0) {
    const availableCount = this.copies.filter(
      (c) => c.status === "available"
    ).length;
    this.availableCopies = availableCount;
    // We might also want to control totalCopies by array length, but let's trust the array
    this.totalCopies = this.copies.length;
  }

  next();
});

bookSchema.methods.incrementCopies = function incrementCopies(count = 1) {
  if (count <= 0) return this;
  const currentCount = this.copies.length;
  const baseId = this.isbn || "BOOK";

  for (let i = 1; i <= count; i++) {
    this.copies.push({
      copyId: `${baseId}-${currentCount + i}`,
      status: "available",
    });
  }
  // pre-save will handle updating the counters
  return this;
};

bookSchema.methods.decrementCopies = function decrementCopies(count = 1) {
  // Removing copies is tricky - remove available ones from the end?
  // For simplicity, let's filter out 'available' copies from the end
  if (count <= 0) return this;

  let removed = 0;
  for (let i = this.copies.length - 1; i >= 0; i--) {
    if (removed >= count) break;
    if (this.copies[i].status === "available") {
      this.copies.splice(i, 1);
      removed++;
    }
  }
  return this;
};

bookSchema.methods.borrowCopy = function borrowCopy() {
  const copyToBorrow = this.copies.find((c) => c.status === "available");
  if (!copyToBorrow) {
    throw new Error("No copies available");
  }
  copyToBorrow.status = "borrowed";
  this.markModified("copies");
  return copyToBorrow.copyId; // Return the ID so it can be used
};

bookSchema.methods.returnCopy = function returnCopy(copyId) {
  // If copyId provided, return that specific one
  if (copyId) {
    const copy = this.copies.find((c) => c.copyId === copyId);
    if (copy) {
      if (copy.status !== "available") {
        copy.status = "available";
        this.markModified("copies");
      }
      return this;
    }
  }

  // Fallback: find any borrowed copy (should usually avoid this path if possible)
  const anyBorrowed = this.copies.find((c) => c.status === "borrowed");
  if (anyBorrowed) {
    anyBorrowed.status = "available";
    this.markModified("copies");
  } else {
    // Just ensure we don't exceed total
    if (this.availableCopies < this.totalCopies) {
      // We can't really fix the array without an ID, so we might just leave it
      // or forcefully free one up? Let's assume ID is always passed in new flow.
    }
  }
  return this;
};

const Book = mongoose.model("Book", bookSchema);

export default Book;
