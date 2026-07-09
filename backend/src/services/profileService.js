import bcrypt from "bcryptjs";

import AppError from "../utils/AppError.js";
import {
    findUserById,
    findUserByIdWithPassword,
    updateUserPassword,
    updateUser
} from "../repositories/userRepository.js";
import { revokeAllRefreshTokensExceptHash } from "../repositories/tokenRepository.js";
import { hashToken } from "../utils/secureToken.js";
import { uploadFileToCloudinary } from "./cloudinaryService.js";
import {
    changePasswordSchema,
    updateProfileSchema
} from "../validators/profileValidator.js";

const sanitizeProfile = (data) => {
    const allowedUpdates = {};

    if (typeof data.name === "string") {
        allowedUpdates.name = data.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(data, "avatarUrl")) {
        allowedUpdates.avatarUrl =
            typeof data.avatarUrl === "string"
                ? data.avatarUrl.trim()
                : null;
    }

    return allowedUpdates;
};

export const getProfileService = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

export const updateProfileService = async (userId, data) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const updates = sanitizeProfile(updateProfileSchema.parse(data));

    if (Object.keys(updates).length === 0) {
        return user;
    }

    return updateUser(userId, updates);
};

export const changePasswordService = async (
    userId,
    data,
    currentRefreshToken
) => {
    const validatedData = changePasswordSchema.parse(data);
    const user = await findUserByIdWithPassword(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isCurrentPasswordValid = await bcrypt.compare(
        validatedData.currentPassword,
        user.password
    );

    if (!isCurrentPasswordValid) {
        throw new AppError("Current password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(
        validatedData.newPassword,
        10
    );

    const updatedUser = await updateUserPassword(userId, {
        password: hashedPassword
    });

    if (currentRefreshToken) {
        await revokeAllRefreshTokensExceptHash(
            userId,
            hashToken(currentRefreshToken)
        );
    }

    return updatedUser;
};

export const uploadProfileAvatarService = async (userId, file) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!file?.mimetype?.startsWith("image/")) {
        throw new AppError("Avatar must be an image", 400);
    }

    const uploadedFile = await uploadFileToCloudinary(
        file,
        "devflow/profile"
    );

    return updateUser(userId, {
        avatarUrl: uploadedFile.secure_url
    });
};
