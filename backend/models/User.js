import mongoose from "mongoose";
import { hashPassword } from "../utils/passwordHash.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    alias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator(value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function encryptPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.confirmPassword;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
