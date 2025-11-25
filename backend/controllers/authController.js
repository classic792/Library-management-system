import { registerUser, loginUser } from "../services/authService.js";
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
    return res.status(500).json({
      message: err.message || "Unable to login",
    });
  }
};
