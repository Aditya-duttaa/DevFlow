import { getDashboardService } from "../services/dashboardService.js";

export const getDashboardController = async (
    req,
    res,
    next
) => {
    try {
        const dashboard =
            await getDashboardService(
                req.params.organizationId,
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: dashboard
        });
    } catch (error) {
        next(error);
    }
};