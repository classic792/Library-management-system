import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (candidate, hashed) => {
  if (!candidate || !hashed) return false;
  return bcrypt.compare(candidate, hashed);
};
