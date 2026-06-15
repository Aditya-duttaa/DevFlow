import prisma from "../config/prisma.js";

export const createComment = async (data) => {
    return prisma.comment.create({
        data
    });
};
export const findCommentsByTaskId = async (taskId) => {
    return prisma.comment.findMany({
        where: {
            taskId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
export const findCommentById = async (commentId) => {
    return prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });
};

export const updateComment = async (commentId, content) => {
    return prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            content
        }
    });
};
export const deleteComment = async (commentId) => {
    return prisma.comment.delete({
        where: {
            id: commentId
        }
    });
};