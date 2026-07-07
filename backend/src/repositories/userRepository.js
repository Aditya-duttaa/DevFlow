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
            createdAt: true,
            updatedAt: true
        }
    });
};

export const findUserByIdWithPassword = async (id) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    });
};

export const findUserByIdForRefresh = async (id) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isEmailVerified: true
        }
    });
};

export const createUser = async (data) => {
    return prisma.user.create({
        data
    });
};

export const updateUserPassword = async (id, data) => {
    return prisma.user.update({
        where: {
            id
        },
        data: {
            password: data.password
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isEmailVerified: true
        }
    });
};

export const markUserEmailVerified = async (id) => {
    return prisma.user.update({
        where: {
            id
        },
        data: {
            isEmailVerified: true
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isEmailVerified: true
        }
    });
};

export const updateUser = async (id, data) => {
    return prisma.user.update({
        where: {
            id
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isEmailVerified: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        }
    });
};
