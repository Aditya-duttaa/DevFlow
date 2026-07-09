import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createAttachmentSchema } from "../validators/attachmentValidator.js";
import upload from "../middlewares/upload.js";

import {
    createAttachmentController,
    getAttachmentsByTaskController,
    deleteAttachmentController
} from "../controllers/attachmentController.js";

const router = Router();

router.post(
    "/",
    protect,
    upload.single("file"),
    validate(createAttachmentSchema),
    createAttachmentController
);

router.get(
    "/task/:taskId",
    protect,
    getAttachmentsByTaskController
);

router.delete(
    "/:attachmentId",
    protect,
    deleteAttachmentController
);

export default router;
