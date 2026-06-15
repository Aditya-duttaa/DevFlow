import {
    getMyNotificationsService,
    markNotificationReadService
} from "../services/notificationService.js";

export const getMyNotificationsController = async (
    req,
    res,
    next
) => {
    try {
        const notifications =
            await getMyNotificationsService(
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

export const markNotificationReadController = async (
    req,
    res,
    next
) => {
    try {
        const notification =
            await markNotificationReadService(
                req.params.notificationId,
                req.user.id
            );

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });
    } catch (error) {
        next(error);
    }
};