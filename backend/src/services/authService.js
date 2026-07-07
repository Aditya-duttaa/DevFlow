import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

import {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByIdForRefresh,
    markUserEmailVerified,
    updateUserPassword
} from "../repositories/userRepository.js";
import { createPreference } from "../repositories/preferenceRepository.js";
import {
    createEmailVerificationToken,
    createPasswordResetToken,
    createRefreshToken,
    deleteEmailVerificationTokenById,
    deleteExpiredEmailVerificationTokens,
    deleteExpiredPasswordResetTokens,
    deletePasswordResetTokenById,
    findEmailVerificationTokenByHash,
    findPasswordResetTokenByHash,
    findRefreshTokenByHash,
    revokeActiveEmailVerificationTokens,
    revokeActivePasswordResetTokens,
    revokeAllRefreshTokensByUserId,
    revokeRefreshTokenByHash
} from "../repositories/tokenRepository.js";
import {
    addHours,
    addMinutes,
    generateSecureToken,
    hashToken
} from "../utils/secureToken.js";
import { generateRefreshToken } from "../utils/token.js";
import {
    sendPasswordResetEmail,
    sendVerificationEmail
} from "./emailService.js";

export const signupUser = async (data) => {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword
    });

    await createPreference(user.id);
    await sendNewVerificationToken(user);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isEmailVerified: user.isEmailVerified
    };
};

export const loginUser = async (data) => {
    const user = await findUserByEmail(data.email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }

    if (process.env.REQUIRE_EMAIL_VERIFICATION === "true" && !user.isEmailVerified) {
        throw new AppError("Please verify your email.", 403);
    }

    return user;
};

export const getCurrentUser = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

export const getRefreshUser = async (userId) => {
    const user = await findUserByIdForRefresh(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

const getSessionExpiry = () => addHours(24 * 7);

const getGenericPasswordResetMessage = () =>
    "If an account exists for this email, password reset instructions have been sent.";

export const createRefreshSession = async (user, meta) => {
    const refreshToken = generateRefreshToken(user);

    await createRefreshToken({
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        device: meta.device,
        ip: meta.ip,
        userAgent: meta.userAgent,
        expiresAt: getSessionExpiry()
    });

    return refreshToken;
};

export const rotateRefreshSession = async (refreshToken, meta) => {
    if (!refreshToken) {
        throw new AppError("Refresh token missing", 401);
    }

    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await findRefreshTokenByHash(tokenHash);

    if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= new Date() ||
        storedToken.userId !== decoded.id
    ) {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    await revokeRefreshTokenByHash(tokenHash);

    const user = await getRefreshUser(decoded.id);
    const newRefreshToken = await createRefreshSession(user, meta);

    return {
        user,
        refreshToken: newRefreshToken
    };
};

export const logoutSession = async (refreshToken) => {
    if (refreshToken) {
        await revokeRefreshTokenByHash(hashToken(refreshToken));
    }
};

export const logoutAllSessions = async (userId) => {
    await revokeAllRefreshTokensByUserId(userId);
};

const sendNewVerificationToken = async (user) => {
    await deleteExpiredEmailVerificationTokens();
    await revokeActiveEmailVerificationTokens(user.id);

    const token = generateSecureToken();

    await createEmailVerificationToken({
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: addHours(24)
    });

    await sendVerificationEmail(user.email, token);
};

export const forgotPasswordService = async (email) => {
    await deleteExpiredPasswordResetTokens();

    const user = await findUserByEmail(email);

    if (!user) {
        return {
            message: getGenericPasswordResetMessage()
        };
    }

    await revokeActivePasswordResetTokens(user.id);

    const token = generateSecureToken();

    await createPasswordResetToken({
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: addMinutes(15)
    });

    try {
        await sendPasswordResetEmail(user.email, token);
    } catch {
        return {
            message: getGenericPasswordResetMessage()
        };
    }

    return {
        message: getGenericPasswordResetMessage()
    };
};

export const resetPasswordService = async ({
    token,
    newPassword
}) => {
    if (!token) {
        throw new AppError("Invalid reset token", 400);
    }

    const storedToken = await findPasswordResetTokenByHash(
        hashToken(token)
    );

    if (!storedToken) {
        throw new AppError("Invalid reset token", 400);
    }

    if (storedToken.usedAt) {
        throw new AppError("Invalid reset token", 400);
    }

    if (storedToken.expiresAt <= new Date()) {
        throw new AppError("Reset token has expired", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(storedToken.userId, {
        password: hashedPassword
    });
    await deletePasswordResetTokenById(storedToken.id);
    await revokeAllRefreshTokensByUserId(storedToken.userId);
};

export const verifyEmailService = async (token) => {
    if (!token) {
        throw new AppError("Invalid verification token", 400);
    }

    const storedToken = await findEmailVerificationTokenByHash(
        hashToken(token)
    );

    if (!storedToken) {
        throw new AppError("Invalid verification token", 400);
    }

    if (storedToken.usedAt) {
        throw new AppError("Verification token has already been used", 400);
    }

    if (storedToken.expiresAt <= new Date()) {
        throw new AppError("Verification token has expired", 400);
    }

    await markUserEmailVerified(storedToken.userId);
    await deleteEmailVerificationTokenById(storedToken.id);
};

export const resendVerificationService = async (email) => {
    const user = await findUserByEmail(email);

    if (!user || user.isEmailVerified) {
        return;
    }

    try {
        await sendNewVerificationToken(user);
    } catch {
        return;
    }
};
