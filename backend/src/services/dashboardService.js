import AppError from "../utils/AppError.js";
import prisma from "../config/prisma.js";
import { findOrganizationById } from "../repositories/organizationRepository.js";
import {
    countProjectsByOrganization,
    findProjectsByOrganizationId
} from "../repositories/projectRepository.js";

import {
    countTasksByProjectIds,
    countTasksByStatus
} from "../repositories/taskRepository.js";

export const getDashboardService = async (
    organizationId,
    currentUserId
) => {
    const organization = await findOrganizationById(
        organizationId
    );

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const member = organization.members.find(
        (m) => m.userId === currentUserId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    const projects =
        await findProjectsByOrganizationId(
            organizationId
        );

    const projectIds = projects.map(
        (project) => project.id
    );

const [totalProjects, totalTasks, statusCounts] =
    await Promise.all([
        countProjectsByOrganization(organizationId),
        countTasksByProjectIds(projectIds),
        prisma.task.groupBy({
            by: ["status"],
            where: {
                projectId: {
                    in: projectIds
                }
            },
            _count: true
        })
    ]);

const todoTasks =
    statusCounts.find(
        (item) => item.status === "TODO"
    )?._count || 0;

const inProgressTasks =
    statusCounts.find(
        (item) => item.status === "IN_PROGRESS"
    )?._count || 0;

const inReviewTasks =
    statusCounts.find(
        (item) => item.status === "IN_REVIEW"
    )?._count || 0;

const doneTasks =
    statusCounts.find(
        (item) => item.status === "DONE"
    )?._count || 0;

    return {
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        inReviewTasks,
        doneTasks,
        totalMembers: organization.members.length
    };
};