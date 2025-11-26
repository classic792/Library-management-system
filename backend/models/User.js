import mongoose from "mongoose";
import { hashPassword } from "../utils/passwordHash.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    lastName: {
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
      lowercase: true,
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
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password);
  this.confirmPassword = undefined;
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await hashPassword(update.password);
    update.confirmPassword = undefined;
    this.setUpdate(update);
  }
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
