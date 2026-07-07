import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
    getPreferencesController,
    updatePreferencesController
} from "../controllers/preferenceController.js";
import { updatePreferenceSchema } from "../validators/preferenceValidator.js";

const router = Router();

router.get("/", protect, getPreferencesController);
router.patch(
    "/",
    protect,
    validate(updatePreferenceSchema),
    updatePreferencesController
);

export default router;
