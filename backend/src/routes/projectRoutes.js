import { Router } from "express";

import { createProjectController,getProjectsController } from "../controllers/projectController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createProjectSchema } from "../validators/projectValidator.js";

const router = Router();

router.post(
    "/",
    protect,
    validate(createProjectSchema),
    createProjectController
);

router.get("/", protect, getProjectsController);

export default router;