import {
    getPreferencesService,
    updatePreferencesService
} from "../services/preferenceService.js";

export const getPreferencesController = async (req, res, next) => {
    try {
        const preferences = await getPreferencesService(req.user.id);

        res.status(200).json({
            success: true,
            data: preferences
        });
    } catch (error) {
        next(error);
    }
};

export const updatePreferencesController = async (req, res, next) => {
    try {
        const preferences = await updatePreferencesService(
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: preferences
        });
    } catch (error) {
        next(error);
    }
};
