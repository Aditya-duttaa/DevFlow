import { createCommentService,getCommentsByTaskService, 
    updateCommentService,deleteCommentService} from "../services/commentService.js";

export const createCommentController = async (req, res, next) => {
    try {
        const comment = await createCommentService(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: comment
        });
    } catch (error) {
        next(error);
    }
};
export const getCommentsByTaskController = async (req, res, next) => {
    try {
        const comments = await getCommentsByTaskService(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        next(error);
    }
};

export const updateCommentController = async (req, res, next) => {
    try {
        const comment = await updateCommentService(
            req.params.commentId,
            req.user.id,
            req.body.content
        );

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: comment
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCommentController = async (req, res, next) => {
    try {
        await deleteCommentService(
            req.params.commentId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};