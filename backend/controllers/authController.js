import { registerUser, loginUser } from "../services/authService.js";
import { googleLogin, googleSignup as googleSignupService } from "../services/googleAuthService.js";
import { signupSchema, loginSchema } from "../utils/validators.js";

const formatValidationErrors = (details) =>
  details.map((detail) => detail.message);

export const signup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatValidationErrors(error.details),
      });
    }

    const result = await registerUser(value);
    return res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Unable to register user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatValidationErrors(error.details),
      });
    }

    const result = await loginUser(value);
    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      // message: err.message || "Unable to login",
    });
    
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }
    const result = await googleSignupService(token);
    return res.status(200).json({
      message: "Google signup successful",
      ...result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Unable to complete Google signup",
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { token, user } = await googleLogin(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.redirect(`${process.env.CLIENT_URL}/user/dashboard`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};
