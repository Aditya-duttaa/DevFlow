import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    forgotPassword,
    login,
    logout,
    logoutAll,
    me,
    refreshAccessToken,
    resendVerification,
    resetPassword,
    signup,
    verifyEmail
} from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import {
    forgotPasswordSchema,
    loginSchema,
    resendVerificationSchema,
    resetPasswordSchema,
    signupSchema
} from "../validators/authValidator.js";

const router = Router();
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: adi@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);
router.post("/logout", logout);
router.post("/logout-all", protect, logoutAll);
router.post("/refresh", refreshAccessToken);
router.post("/refresh-token", refreshAccessToken);
router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword
);
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
);
router.get("/verify-email", verifyEmail);
router.post(
    "/resend-verification",
    validate(resendVerificationSchema),
    resendVerification
);

export default router;
