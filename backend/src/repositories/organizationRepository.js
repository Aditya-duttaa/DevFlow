import prisma from "../config/prisma.js";

const organizationMemberInclude = {
    members: {
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

export const findOrganizationBySlug = async (slug) => {
    return prisma.organization.findUnique({
        where: {
            slug
        }
    });
};

export const createOrganizationWithOwner = async ({ name, slug, description, userId }) => {
    return prisma.organization.create({
        data: {
            name,
            slug,
            description,
            members: {
                create: {
                    userId,
                    role: "OWNER"
                }
            }
        },
        include: {
            members: true
        }
    });
};

export const findOrganizationsByUserId = async (userId) => {
    return prisma.organization.findMany({
        where: {
            members: {
                some: {
                    userId
                }
            }
        },
        include: {
            members: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const findOrganizationById = async (organizationId) => {
    return prisma.organization.findUnique({
        where: {
            id: organizationId
        },
        include: organizationMemberInclude
    });
};

export const updateOrganizationById = async (organizationId, data) => {
    return prisma.organization.update({
        where: {
            id: organizationId
        },
        data,
        include: organizationMemberInclude
    });
};

export const addOrganizationMember = async (
    organizationId,
    userId,
    role
) => {
    return prisma.organizationMember.create({
        data: {
            organizationId,
            userId,
            role
        }
    });
};

export const deleteOrganizationMember = async (memberId) => {
    return prisma.organizationMember.delete({
        where: {
            id: memberId
        }
    });
};

export const updateMemberRole = async (
    memberId,
    role
) => {
    return prisma.organizationMember.update({
        where: {
            id: memberId
        },
        data: {
            role
        }
    });
};
