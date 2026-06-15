import prisma from "../config/prisma.js";

export const createActivityLog = async (data) => {
    return prisma.activityLog.create({
        data
    });
};

export const getOrganizationActivities = async (organizationId) => {
    return prisma.activityLog.findMany({
        where: {
            organizationId
        },
        include: {
            actor: true,
            task: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};