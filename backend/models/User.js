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
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      sparse: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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

userSchema
  .virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (val) {
    this._confirmPassword = val;
  });

userSchema.pre("validate", function (next) {
  if (this.isNew || this.isModified("password")) {
    if (!this._confirmPassword) {
      this.invalidate("confirmPassword", "Confirm password is required");
    } else if (this.password !== this._confirmPassword) {
      this.invalidate("confirmPassword", "Passwords do not match");
    }
  }
  next();
});

userSchema.pre("save", async function encryptPassword(next) {
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password);
  this.confirmPassword = undefined;
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  // supports both {$set: {password: ...}} and direct updates
  const password = update.password || (update.$set && update.$set.password);
  if (password) {
    const hashed = await hashPassword(password);
    if (update.password) update.password = hashed;
    if (update.$set && update.$set.password) update.$set.password = hashed;
  }
  // remove confirmPassword if present
  if (update.confirmPassword) delete update.confirmPassword;
  if (update.$set && update.$set.confirmPassword)
    delete update.$set.confirmPassword;
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
