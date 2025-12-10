import express from "express";
import { getUserDashboard } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("member"),
  getUserDashboard
);

export default router;
