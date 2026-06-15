import { Router } from "express";
import prisma from "../config/prisma.js";
import authRoutes from "./authRoutes.js";
import { protect } from "../middlewares/authMiddleware.js";
import organizationRoutes from "./organizationRoutes.js";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";
import commentRoutes from "./commentRoutes.js";
import activityRoutes from "./activityRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import attachmentRoutes from "./attachmentRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});
router.get("/db-health", async (req, res, next) => {
    try {
        await prisma.user.findMany({
            take: 1
        });

        res.status(200).json({
            success: true,
            message: "Database connected"
        });
    } catch (error) {
        next(error);
    }
});
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DevFlow API is running"
    });
});
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/comments",commentRoutes);
router.use("/activities", activityRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/attachments", attachmentRoutes);
router.use("/notifications", notificationRoutes);
export default router;