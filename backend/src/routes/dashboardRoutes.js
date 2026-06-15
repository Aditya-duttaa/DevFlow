import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
    getDashboardController
} from "../controllers/dashboardController.js";

const router = Router();

router.get(
    "/organization/:organizationId",
    protect,
    getDashboardController
);

export default router;