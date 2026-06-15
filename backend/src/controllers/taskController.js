import { createTaskService,getTasksByProject,
    changeTaskStatus,assignTaskService ,
    unassignTaskService,deleteTaskService,
     updateTaskService,getTaskService} from "../services/taskService.js";

export const createTaskController = async (req, res, next) => {
    try {
        const task = await createTaskService(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
};

export const getTasksController = async (req, res, next) => {
    try {
        const tasks = await getTasksByProject(
            req.query.projectId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

export const changeTaskStatusController = async (req, res, next) => {
    try {
        const task = await changeTaskStatus(
            req.params.taskId,
            req.user.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
};

export const assignTaskController = async (req, res, next) => {
    try {
        const task = await assignTaskService(
            req.params.taskId,
            req.user.id,
            req.body.assigneeId
        );

        res.status(200).json({
            success: true,
            message: "Task assigned successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
};

export const unassignTaskController = async (req, res, next) => {
    try {
        const task = await unassignTaskService(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Task unassigned successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTaskController = async (req, res, next) => {
    try {
        await deleteTaskService(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const updateTaskController = async (req, res, next) => {
    try {
        const task = await updateTaskService(
            req.params.taskId,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    } catch (error) {
        next(error);
    }
};
export const getTaskController = async (req, res, next) => {
    try {
        const task = await getTaskService(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};