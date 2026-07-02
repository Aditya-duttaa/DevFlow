import AppError from "../utils/AppError.js";

import { findOrganizationById } from "../repositories/organizationRepository.js";

import {
    createProject,
    findProjectsByOrganizationId,
    findProjectById,
    updateProjectById,
    deleteProjectById
} from "../repositories/projectRepository.js";

function checkPermission(member) {
    if (!member) {
        throw new AppError("Forbidden", 403);
    }
}

function checkManager(member) {
    if (
        !["OWNER", "ADMIN", "MANAGER"].includes(member.role)
    ) {
        throw new AppError(
            "Only owner, admin or manager can perform this action",
            403
        );
    }
}

export const createProjectService = async (
    data,
    userId
) => {
    const organization =
        await findOrganizationById(data.organizationId);

    if (!organization) {
        throw new AppError(
            "Organization not found",
            404
        );
    }

    const member = organization.members.find(
        (m) => m.userId === userId
    );

    checkPermission(member);
    checkManager(member);

    return createProject(data);
};

export const getProjectsByOrganization = async (
    organizationId,
    userId
) => {
    const organization =
        await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError(
            "Organization not found",
            404
        );
    }

    const member = organization.members.find(
        (m) => m.userId === userId
    );

    checkPermission(member);

    return findProjectsByOrganizationId(
        organizationId
    );
};

export const getProjectService = async (
    projectId,
    userId
) => {
    const project =
        await findProjectById(projectId);

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const organization =
        await findOrganizationById(
            project.organizationId
        );

    const member = organization.members.find(
        (m) => m.userId === userId
    );

    checkPermission(member);

    return project;
};

export const updateProjectService = async (
    projectId,
    userId,
    data
) => {
    const project =
        await findProjectById(projectId);

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const organization =
        await findOrganizationById(
            project.organizationId
        );

    const member = organization.members.find(
        (m) => m.userId === userId
    );

    checkPermission(member);
    checkManager(member);

    return updateProjectById(
        projectId,
        data
    );
};

export const deleteProjectService = async (
    projectId,
    userId
) => {
    const project =
        await findProjectById(projectId);

    if (!project) {
        throw new AppError(
            "Project not found",
            404
        );
    }

    const organization =
        await findOrganizationById(
            project.organizationId
        );

    const member = organization.members.find(
        (m) => m.userId === userId
    );

    checkPermission(member);
    checkManager(member);

    await deleteProjectById(projectId);
};