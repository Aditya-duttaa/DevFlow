import AppError from "../utils/AppError.js";

import { findOrganizationById } from "../repositories/organizationRepository.js";
import { getOrganizationActivities } from "../repositories/activityRepository.js";

export const getActivityFeedService = async (
    organizationId,
    currentUserId
) => {
    const organization = await findOrganizationById(organizationId);

    if (!organization) {
        throw new AppError("Organization not found", 404);
    }

    const member = organization.members.find(
        (m) => m.userId === currentUserId
    );

    if (!member) {
        throw new AppError("Forbidden", 403);
    }

    return getOrganizationActivities(organizationId);
};