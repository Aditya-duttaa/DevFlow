import prisma from "../config/prisma.js";

export const createAttachment = async (data) => {
    return prisma.attachment.create({
        data
    });
};

export const findAttachmentsByTaskId = async (taskId) => {
    return prisma.attachment.findMany({
        where: {
            taskId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const findAttachmentById = async (attachmentId) => {
    return prisma.attachment.findUnique({
        where: {
            id: attachmentId
        }
    });
};

export const deleteAttachment = async (attachmentId) => {
    return prisma.attachment.delete({
        where: {
            id: attachmentId
        }
    });
};