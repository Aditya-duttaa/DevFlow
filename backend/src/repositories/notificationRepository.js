import prisma from "../config/prisma.js";

export const createNotification = async (data) => {
    return prisma.notification.create({
        data
    });
};

export const findNotificationsByRecipient = async (recipientId) => {
    return prisma.notification.findMany({
        where: {
            recipientId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const markNotificationAsRead = async (notificationId) => {
    return prisma.notification.update({
        where: {
            id: notificationId
        },
        data: {
            isRead: true
        }
    });
};

export const findNotificationById = async (notificationId) => {
    return prisma.notification.findUnique({
        where: {
            id: notificationId
        }
    });
};