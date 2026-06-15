import { getActivityFeedService } from "../services/activityService.js";

export const getActivityFeedController = async (
    req,
    res,
    next
) => {
    try {
        const activities =
            await getActivityFeedService(
                req.params.organizationId,
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        next(error);
    }
};