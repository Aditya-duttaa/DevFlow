import prisma from "../config/prisma.js";

export const createTask = async (data) => {
    return prisma.task.create({
        data
    });
};

export const findTasksByProjectId = async (projectId) => {
    return prisma.task.findMany({
        where: {
            projectId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const findTaskById = async (taskId) => {
    return prisma.task.findUnique({
        where: {
            id: taskId
        }
    });
};

export const updateTaskStatus = async (taskId, status) => {
    return prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            status
        }
    });
};

export const assignTask = async (taskId, assigneeId) => {
    return prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            assigneeId
        }
    });
};

export const unassignTask = async (taskId) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: {
      assigneeId: null,
    },
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
        data
    });
};
export const getTaskById = async (taskId) => {
    return prisma.task.findUnique({
        where: {
            id: taskId
        }
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