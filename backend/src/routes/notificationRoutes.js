import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
    getMyNotificationsController,
    markNotificationReadController
} from "../controllers/notificationController.js";

const router = Router();

router.get(
    "/",
    protect,
    getMyNotificationsController
);

router.patch(
    "/:notificationId/read",
    protect,
    markNotificationReadController
);

export default router;