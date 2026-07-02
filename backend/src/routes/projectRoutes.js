import { Router } from "express";

import {
    createProjectController,
    getProjectsController,
    getProjectController,
    updateProjectController,
    deleteProjectController
} from "../controllers/projectController.js";

import {
    createProjectSchema,
    updateProjectSchema
} from "../validators/projectValidator.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.post(
    "/",
    protect,
    validate(createProjectSchema),
    createProjectController
);

router.get("/", protect, getProjectsController);
router.get("/:projectId", protect, getProjectController);

router.patch(
    "/:projectId",
    protect,
    validate(updateProjectSchema),
    updateProjectController
);

router.delete(
    "/:projectId",
    protect,
    deleteProjectController
);

router.get(
    "/:projectId",
    protect,
    getProjectController
);

router.patch(
    "/:projectId",
    protect,
    validate(updateProjectSchema),
    updateProjectController
);

router.delete(
    "/:projectId",
    protect,
    deleteProjectController
);
export default router;