import AppError from "../utils/AppError.js";

import { findTaskById } from "../repositories/taskRepository.js";
import { findProjectById } from "../repositories/projectRepository.js";
import { findOrganizationById } from "../repositories/organizationRepository.js";

import {
    createAttachment,
    findAttachmentsByTaskId,
    findAttachmentById,
    deleteAttachment
} from "../repositories/attachmentRepository.js";
import {
    deleteFileFromCloudinary,
    uploadFileToCloudinary
} from "./cloudinaryService.js";

export const createAttachmentService = async (
    data,
    file,
    currentUserId
) => {
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

    const uploadedFile = await uploadFileToCloudinary(
        file,
        "devflow/tasks"
    );

    return createAttachment({
        fileName: file.originalname,
        fileUrl: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        fileType: file.mimetype,
        fileSize: file.size,
        taskId: data.taskId,
        uploadedById: member.id
    });
};

export const getAttachmentsByTaskService = async (taskId, currentUserId) => {
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

    return findAttachmentsByTaskId(taskId);
};

export const deleteAttachmentService = async (
    attachmentId,
    currentUserId
) => {
    const attachment = await findAttachmentById(attachmentId);

    if (!attachment) {
        throw new AppError("Attachment not found", 404);
    }

    const task = await findTaskById(attachment.taskId);
    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const member = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    if (attachment.uploadedById !== member.id) {
        throw new AppError("You can only delete your own attachments", 403);
    }

    await deleteFileFromCloudinary(attachment.publicId);

    return deleteAttachment(attachmentId);
};
