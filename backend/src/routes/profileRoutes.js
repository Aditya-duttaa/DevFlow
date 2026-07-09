import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
    changePasswordController,
    getProfileController,
    uploadProfileAvatarController,
    updateProfileController
} from "../controllers/profileController.js";
import upload from "../middlewares/upload.js";
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

router.patch(
    "/avatar",
    protect,
    upload.single("avatar"),
    uploadProfileAvatarController
);

export default router;
