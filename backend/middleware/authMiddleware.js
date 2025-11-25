import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const token = tokenFromHeader || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};
