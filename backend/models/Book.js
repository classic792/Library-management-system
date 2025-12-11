import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

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
    },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Worn", "Damaged"],
      default: "Good",
    },
    isbn: {
      type: String,
      unique: true,
      trim: true,
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
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

  borrowingHistory: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
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
  bookSchema.pre("save", async function (next) {
    try {
      if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
          { key: "bookId" },
          { $inc: { value: 1 } },
          { new: true, upsert: true }
        );
        const baseNumber = 9780000000000;
        const isbnNumber = baseNumber + counter.value;
        this.isbn = isbnNumber.toString();
      }
      next();
    } catch (error) {
      next(error);
      console.log(error.message);
    }
  });

bookSchema.pre("save", function normalizeCopies(next) {
  if (this.availableCopies == null) {
    this.availableCopies = this.totalCopies;
  }

  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }

  next();
});

bookSchema.methods.incrementCopies = function incrementCopies(count = 1) {
  if (count <= 0) return this;
  this.totalCopies += count;
  this.availableCopies += count;
  return this;
};

bookSchema.methods.decrementCopies = function decrementCopies(count = 1) {
  if (count <= 0) return this;
  this.totalCopies = Math.max(0, this.totalCopies - count);
  this.availableCopies = Math.min(this.availableCopies, this.totalCopies);
  return this;
};

bookSchema.methods.borrowCopy = function borrowCopy() {
  if (this.availableCopies <= 0) {
    throw new Error("No copies available");
  }
  this.availableCopies -= 1;
  return this;
};

bookSchema.methods.returnCopy = function returnCopy() {
  if (this.availableCopies < this.totalCopies) {
    this.availableCopies += 1;
  }
  return this;
};

const Book = mongoose.model("Book", bookSchema);

export default Book;
