import { Router } from "express";

import { createTaskController,getTasksController,
    changeTaskStatusController,assignTaskController,
    unassignTaskController,deleteTaskController, 
    updateTaskController,getTaskController } from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createTaskSchema,updateTaskStatusSchema,assignTaskSchema,updateTaskSchema } from "../validators/taskValidator.js";

const router = Router();

router.post(
    "/",
    protect,
    validate(createTaskSchema),
    createTaskController
);
router.get("/", protect, getTasksController);
router.patch(
    "/:taskId/status",
    protect,
    validate(updateTaskStatusSchema),
    changeTaskStatusController
);
router.patch(
    "/:taskId/assign",
    protect,
    validate(assignTaskSchema),
    assignTaskController
);
router.patch(
    "/:taskId/unassign",
    protect,
    unassignTaskController
);

router.delete(
    "/:taskId",
    protect,
    deleteTaskController
);
router.patch(
    "/:taskId",
    protect,
    validate(updateTaskSchema),
    updateTaskController
);

router.get(
    "/:taskId",
    protect,
    getTaskController
);
export default router;