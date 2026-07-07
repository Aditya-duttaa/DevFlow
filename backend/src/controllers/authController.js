import {
    createRefreshSession,
    forgotPasswordService,
    loginUser,
    logoutAllSessions,
    logoutSession,
    resendVerificationService,
    resetPasswordService,
    rotateRefreshSession,
    signupUser,
    getCurrentUser,
    verifyEmailService
} from "../services/authService.js";
import { generateAccessToken } from "../utils/token.js";

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const getRequestMeta = (req) => ({
    device: req.headers["user-agent"]?.slice(0, 120) || "Unknown",
    ip: req.ip,
    userAgent: req.headers["user-agent"] || ""
});

export const signup = async (req, res, next) => {
    try {
        const user = await signupUser(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await loginUser(req.body);

        const accessToken = generateAccessToken(user);
        const refreshToken = await createRefreshSession(
            user,
            getRequestMeta(req)
        );

        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isEmailVerified: user.isEmailVerified
                },
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req, res, next) => {
    try {
        const user = await getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await logoutSession(req.cookies.refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
};

export const refreshAccessToken = async (req, res, next) => {
    try {
        const session = await rotateRefreshSession(
            req.cookies.refreshToken,
            getRequestMeta(req)
        );

        const newAccessToken = generateAccessToken(session.user);

        res.cookie(
            "refreshToken",
            session.refreshToken,
            refreshCookieOptions
        );

        res.status(200).json({
            success: true,
            message: "Access token refreshed",
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const logoutAll = async (req, res, next) => {
    try {
        await logoutAllSessions(req.user.id);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Logged out from all sessions"
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const result = await forgotPasswordService(req.body.email);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        await resetPasswordService(req.body);

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        await verifyEmailService(req.query.token);

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const resendVerification = async (req, res, next) => {
    try {
        await resendVerificationService(req.body.email);

        res.status(200).json({
            success: true,
            message: "If the account needs verification, a new email has been sent."
        });
    } catch (error) {
        next(error);
    }
};
