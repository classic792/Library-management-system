import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getAdminStatsController } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/stats",
  authenticate,
  authorizeRoles("admin"),
  getAdminStatsController
);

export default router;
