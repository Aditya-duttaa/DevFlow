import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";
import { findTaskById } from "../repositories/taskRepository.js";
import { findProjectById } from "../repositories/projectRepository.js";
import { findOrganizationById } from "../repositories/organizationRepository.js";
import { createComment,findCommentsByTaskId,findCommentById,
updateComment,deleteComment } from "../repositories/commentRepository.js";
import { createActivityLog } from "../repositories/activityRepository.js";
import { createNotification } from "../repositories/notificationRepository.js";

export const createCommentService = async (data, currentUserId) => {
    const task = await findTaskById(data.taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const member = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }
    const comment = await createComment({
    content: data.content,
    taskId: data.taskId,
    authorId: member.id
});

    await createActivityLog({
        action: "COMMENT_CREATED",
        organizationId: organization.id,
        actorId: member.id,
        taskId: task.id,
        message: "Added a comment"
    });
    if (task.assigneeId && task.assigneeId !== member.id) {
        await createNotification({
            type: "COMMENT_CREATED",
            title: "New comment on task",
            message: `New comment added on task ${task.title}`,
            recipientId: task.assigneeId
        });
    }

    return comment;
};
export const getCommentsByTaskService = async (taskId, currentUserId) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const member = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    return findCommentsByTaskId(taskId);
};

export const updateCommentService = async (
    commentId,
    currentUserId,
    content
) => {
    const comment = await findCommentById(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    const member = await prisma.organizationMember.findFirst({
        where: {
            userId: currentUserId,
            id: comment.authorId
        }
    });

    if (!member) {
        throw new AppError(
            "You can only edit your own comments",
            403
        );
    }
const updatedComment = await updateComment(commentId, content);

const task = await findTaskById(comment.taskId);
const project = await findProjectById(task.projectId);

await createActivityLog({
    action: "COMMENT_UPDATED",
    organizationId: project.organizationId,
    actorId: member.id,
    taskId: task.id,
    message: "Updated a comment"
});

return updatedComment;
    
};

export const deleteCommentService = async (
    commentId,
    currentUserId
) => {
    const comment = await findCommentById(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    const member = await prisma.organizationMember.findFirst({
        where: {
            userId: currentUserId,
            id: comment.authorId
        }
    });

    if (!member) {
        throw new AppError(
            "You can only delete your own comments",
            403
        );
    }
const task = await findTaskById(comment.taskId);
const project = await findProjectById(task.projectId);

await createActivityLog({
    action: "COMMENT_DELETED",
    organizationId: project.organizationId,
    actorId: member.id,
    taskId: task.id,
    message: "Deleted a comment"
});

return deleteComment(commentId);
    
};
//c4ff6ab8-98bb-49c6-95cb-78eee4f9ddff
//e7e2c954-7e35-485e-9dcd-00d0711a536f