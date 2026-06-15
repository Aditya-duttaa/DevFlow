import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

import { createUser, findUserByEmail, findUserById } from "../repositories/userRepository.js";

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