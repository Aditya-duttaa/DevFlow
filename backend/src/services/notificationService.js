import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";

import {
    findNotificationsByRecipient,
    findNotificationById,
    markNotificationAsRead
} from "../repositories/notificationRepository.js";

export const getMyNotificationsService = async (currentUserId) => {
    const members = await prisma.organizationMember.findMany({
        where: {
            userId: currentUserId
        },
        select: {
            id: true
        }
    });

    const memberIds = members.map((member) => member.id);

    return prisma.notification.findMany({
        where: {
            recipientId: {
                in: memberIds
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const markNotificationReadService = async (
    notificationId,
    currentUserId
) => {
    const notification = await findNotificationById(notificationId);

    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    const member = await prisma.organizationMember.findFirst({
        where: {
            userId: currentUserId,
            id: notification.recipientId
        }
    });

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    return markNotificationAsRead(notificationId);
};