import prisma from "../config/prisma.js";

const taskInclude = {
    assignee: {
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    }
};

export const createTask = async (data) => {
    return prisma.task.create({
        data,
        include: taskInclude
    });
};

export const findTasksByProjectId = async (projectId) => {
    return prisma.task.findMany({
        where: {
            projectId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: taskInclude
    });
};

export const findTaskById = async (taskId) => {
    return prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: taskInclude
    });
};

export const updateTaskStatus = async (taskId, status) => {
    return prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            status
        },
        include: taskInclude
    });
};

export const assignTask = async (taskId, assigneeId) => {
    return prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            assigneeId
        },
        include: taskInclude
    });
};

export const unassignTask = async (taskId) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: {
      assigneeId: null,
    },
    include: taskInclude
  });
};
export const deleteTask = async (taskId) => {
    return prisma.task.delete({
        where: {
            id: taskId
        }
    });
};
export const updateTask = async (taskId, data) => {
    return prisma.task.update({
        where: {
            id: taskId
        },
        data,
        include: taskInclude
    });
};
export const getTaskById = async (taskId) => {
    return prisma.task.findUnique({
        where: {
            id: taskId
        },
        include: taskInclude
    });
};
export const countTasksByProjectIds = async (projectIds) => {
    return prisma.task.count({
        where: {
            projectId: {
                in: projectIds
            }
        }
    });
};
export const countTasksByStatus = async (
    projectIds,
    status
) => {
    return prisma.task.count({
        where: {
            projectId: {
                in: projectIds
            },
            status
        }
    });
};
