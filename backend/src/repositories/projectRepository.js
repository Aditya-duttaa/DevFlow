import prisma from "../config/prisma.js";

export const createProject = async (data) => {
    return prisma.project.create({
        data
    });
};

export const findProjectsByOrganizationId = async (organizationId) => {
    return prisma.project.findMany({
        where: {
            organizationId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const findProjectById = async (projectId) => {
    return prisma.project.findUnique({
        where: {
            id: projectId
        }
    });
};
export const countProjectsByOrganization = async (organizationId) => {
    return prisma.project.count({
        where: {
            organizationId
        }
    });
};
