import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createCommentSchema,updateCommentSchema } from "../validators/commentValidator.js";
import { createCommentController,getCommentsByTaskController,
    updateCommentController ,deleteCommentController} from "../controllers/commentController.js";

const router = Router();

router.post(
    "/",
    protect,
    validate(createCommentSchema),
    createCommentController
);
router.get(
    "/task/:taskId",
    protect,
    getCommentsByTaskController
);
router.patch(
    "/:commentId",
    protect,
    validate(updateCommentSchema),
    updateCommentController
);
router.delete(
    "/:commentId",
    protect,
    deleteCommentController
);
export default router;