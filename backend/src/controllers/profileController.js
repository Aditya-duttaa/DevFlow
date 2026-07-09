import {
    changePasswordService,
    getProfileService,
    uploadProfileAvatarService,
    updateProfileService
} from "../services/profileService.js";

export const getProfileController = async (req, res, next) => {
    try {
        const user = await getProfileService(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfileController = async (req, res, next) => {
    try {
        const user = await updateProfileService(
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const changePasswordController = async (req, res, next) => {
    try {
        await changePasswordService(
            req.user.id,
            req.body,
            req.cookies.refreshToken
        );

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const uploadProfileAvatarController = async (req, res, next) => {
    try {
        const user = await uploadProfileAvatarService(
            req.user.id,
            req.file
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
