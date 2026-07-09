import { searchUsersService } from "../services/userService.js";

export const searchUsersController = async (req, res, next) => {
    try {
        const users = await searchUsersService(req.query.q);

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};
