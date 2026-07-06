import AppError from "../utils/AppError.js";
import { findProjectById } from "../repositories/projectRepository.js";
import { findOrganizationById } from "../repositories/organizationRepository.js";
import { createTask,
    findTasksByProjectId,
    findTaskById,
    updateTaskStatus,
    assignTask,
    unassignTask,
    deleteTask,
    updateTask
 } from "../repositories/taskRepository.js";
 import { createActivityLog } from "../repositories/activityRepository.js";
import { createNotification } from "../repositories/notificationRepository.js";

export const createTaskService = async (data, userId) => {
    const project = await findProjectById(data.projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const organization = await findOrganizationById(project.organizationId);

    const member = organization.members.find(
        (member) => member.userId === userId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN", "MANAGER", "DEVELOPER"].includes(member.role)) {
        throw new AppError("You cannot create task", 403);
    }

    if (data.assigneeId) {
        const assignee = organization.members.find(
            (member) => member.id === data.assigneeId
        );

        if (!assignee) {
            throw new AppError(
                "Assignee is not a member of this organization",
                400
            );
        }
    }

    const newTask = await createTask(data);

await createActivityLog({
    action: "TASK_CREATED",
    organizationId: organization.id,
    actorId: member.id,
    taskId: newTask.id,
    message: `Created task ${newTask.title}`
});

if (data.assigneeId) {
    await createActivityLog({
        action: "TASK_ASSIGNED",
        organizationId: organization.id,
        actorId: member.id,
        taskId: newTask.id,
        message: `Assigned task to ${newTask.assignee?.user?.name ?? "member"}`
    });

    await createNotification({
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: `You have been assigned task ${newTask.title}`,
        recipientId: data.assigneeId
    });
}

return newTask;
};

export const getTasksByProject = async (projectId, userId) => {
    const project = await findProjectById(projectId);

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const organization = await findOrganizationById(project.organizationId);

    const member = organization.members.find(
        (member) => member.userId === userId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    return findTasksByProjectId(projectId);
};

export const changeTaskStatus = async (taskId, userId, status) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const member = organization.members.find(
        (member) => member.userId === userId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    const updatedTask = await updateTaskStatus(taskId, status);

    await createActivityLog({
        action: "TASK_STATUS_CHANGED",
        organizationId: organization.id,
        actorId: member.id,
        taskId: task.id,
        message: `Changed task status to ${status}`
    });

    if (task.assigneeId) {
        await createNotification({
            type: "TASK_STATUS_CHANGED",
            title: "Task status changed",
            message: `Task ${task.title} status changed to ${status}`,
            recipientId: task.assigneeId
        });
    }

    return updatedTask;
};

export const assignTaskService = async (
    taskId,
    currentUserId,
    assigneeId
) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN", "MANAGER"].includes(currentMember.role)) {
        throw new AppError("Only owner, admin or manager can assign tasks", 403);
    }

    const assignee = organization.members.find(
        (member) => member.id === assigneeId
    );

    if (!assignee) {
        throw new AppError("Assignee is not a member of this organization", 400);
    }

    await createNotification({
        type: "TASK_ASSIGNED",
        title: "New task assigned",
        message: `You have been assigned task ${task.title}`,
        recipientId: assignee.id
    });

    const updatedTask = await assignTask(taskId, assigneeId);

await createActivityLog({
    action: "TASK_ASSIGNED",
    organizationId: organization.id,
    actorId: currentMember.id,
    taskId: task.id,
    message: "Task assigned"
});

return updatedTask;
};

export const unassignTaskService = async (taskId, currentUserId) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN", "MANAGER"].includes(currentMember.role)) {
        throw new AppError("Only owner, admin or manager can unassign tasks", 403);
    }

    const updatedTask = await unassignTask(taskId);

await createActivityLog({
    action: "TASK_UNASSIGNED",
    organizationId: organization.id,
    actorId: currentMember.id,
    taskId: task.id,
    message: "Task unassigned"
});

return updatedTask;
};

export const deleteTaskService = async (taskId, currentUserId) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN", "MANAGER"].includes(currentMember.role)) {
        throw new AppError("Only owner, admin or manager can delete tasks", 403);
    }

    await createActivityLog({
    action: "TASK_DELETED",
    organizationId: organization.id,
    actorId: currentMember.id,
    taskId: task.id,
    message: `Deleted task ${task.title}`
});

return deleteTask(taskId);
};

export const updateTaskService = async (
    taskId,
    currentUserId,
    data
) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    const updatedTask = await updateTask(taskId, data);

await createActivityLog({
    action: "TASK_UPDATED",
    organizationId: organization.id,
    actorId: currentMember.id,
    taskId: task.id,
    message: `Updated task ${task.title}`
});

return updatedTask;
};

export const getTaskService = async (taskId, currentUserId) => {
    const task = await findTaskById(taskId);

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const project = await findProjectById(task.projectId);
    const organization = await findOrganizationById(project.organizationId);

    const currentMember = organization.members.find(
        (member) => member.userId === currentUserId
    );

    if (!currentMember) {
        throw new AppError("Forbidden", 403);
    }

    return task;
};
