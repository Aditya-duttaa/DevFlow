import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { searchUsersController } from "../controllers/userController.js";

const router = Router();

router.get("/search", protect, searchUsersController);

export default router;
