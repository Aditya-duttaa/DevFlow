import prisma from "../config/prisma.js";

export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
};

export const findUserById = async (id) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isEmailVerified: true,
            isActive: true,
            createdAt: true
        }
    });
};

export const createUser = async (data) => {
    return prisma.user.create({
        data
    });
};