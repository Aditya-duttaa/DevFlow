import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
    changePasswordController,
    getProfileController,
    updateProfileController
} from "../controllers/profileController.js";
import {
    changePasswordSchema,
    updateProfileSchema
} from "../validators/profileValidator.js";

const router = Router();

router.get("/", protect, getProfileController);

router.patch(
    "/",
    protect,
    validate(updateProfileSchema),
    updateProfileController
);

router.patch(
    "/password",
    protect,
    validate(changePasswordSchema),
    changePasswordController
);

export default router;
