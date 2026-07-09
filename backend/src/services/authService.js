import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

import {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByIdForRefresh,
    updateUserPassword
} from "../repositories/userRepository.js";
import {
    createRefreshToken,
    findRefreshTokenByHash,
    revokeAllRefreshTokensByUserId,
    revokeRefreshTokenByHash
} from "../repositories/tokenRepository.js";
import {
    addHours,
    hashToken
} from "../utils/secureToken.js";
import { generateRefreshToken } from "../utils/token.js";

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
