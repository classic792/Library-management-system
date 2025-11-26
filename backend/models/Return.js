import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    borrow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
      required: true,
      unique: true,
    },
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
    returnDate: {
      type: Date,
      default: Date.now,
    },
    condition: {
      type: String,
      enum: ["good", "damaged", "lost"],
      default: "good",
    },
    fine: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
returnSchema.index({ user: 1, returnDate: -1 });
returnSchema.index({ book: 1, returnDate: -1 });

const Return = mongoose.model("Return", returnSchema);

export default Return;