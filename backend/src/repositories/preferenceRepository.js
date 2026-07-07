import prisma from "../config/prisma.js";

export const findPreferenceByUserId = async (userId) => {
    return prisma.userPreference.findUnique({
        where: {
            userId
        }
    });
};

export const createPreference = async (userId) => {
    return prisma.userPreference.create({
        data: {
            userId
        }
    });
};

export const upsertPreference = async (userId, data) => {
    return prisma.userPreference.upsert({
        where: {
            userId
        },
        create: {
            userId,
            ...data
        },
        update: data
    });
};
