import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
    getActivityFeedController
} from "../controllers/activityController.js";

const router = Router();

router.get(
    "/organization/:organizationId",
    protect,
    getActivityFeedController
);

export default router;