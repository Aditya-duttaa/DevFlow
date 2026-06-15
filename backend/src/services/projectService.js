import AppError from "../utils/AppError.js";

import { findOrganizationById } from "../repositories/organizationRepository.js";
import {
    createProject,
    findProjectsByOrganizationId
} from "../repositories/projectRepository.js";

export const createProjectService = async (data, userId) => {
    const organization = await findOrganizationById(data.organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const member = organization.members.find(
        (member) => member.userId === userId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    if (!["OWNER", "ADMIN", "MANAGER"].includes(member.role)) {
        throw new AppError("Only owner, admin or manager can create project", 403);
    }

    return createProject(data);
};

export const getProjectsByOrganization = async (organizationId, userId) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const member = organization.members.find(
        (member) => member.userId === userId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    return findProjectsByOrganizationId(organizationId);
};