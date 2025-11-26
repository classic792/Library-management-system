import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { comparePassword } from "../utils/passwordHash.js";

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject();
  delete user.password;
  delete user.confirmPassword;
  return user;
};

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign({ sub: userId, role }, secret, { expiresIn });
};

const throwHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const registerUser = async (payload) => {
  const { email, alias } = payload;
  const existingUser = await User.findOne({
    $or: [{ email }, { alias }],
  });
  if (existingUser) {
    throwHttpError("User with provided email or alias already exists", 409);
  }

  const newUser = await User.create({
    ...payload,
    email,
    alias,
  });
  const token = generateToken(newUser._id, newUser.role);

  return {
    user: sanitizeUser(newUser),
    token,
  };
};

export const loginUser = async ({ identifier, password }) => {
  const normalizedIdentifier = identifier?.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: normalizedIdentifier }, { alias: normalizedIdentifier }],
  }).select("+password");

  if (!user) {
    throwHttpError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throwHttpError("Password mismatch", 401);
  }

  const token = generateToken(user._id, user.role);

  return {
    user: sanitizeUser(user),
    token,
  };
};
