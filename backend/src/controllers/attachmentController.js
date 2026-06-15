import {
    createAttachmentService,
    getAttachmentsByTaskService,
    deleteAttachmentService
} from "../services/attachmentService.js";

export const createAttachmentController = async (req, res, next) => {
    try {
        const attachment = await createAttachmentService(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Attachment added successfully",
            data: attachment
        });
    } catch (error) {
        next(error);
    }
};

export const getAttachmentsByTaskController = async (req, res, next) => {
    try {
        const attachments = await getAttachmentsByTaskService(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: attachments
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAttachmentController = async (req, res, next) => {
    try {
        await deleteAttachmentService(
            req.params.attachmentId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Attachment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};