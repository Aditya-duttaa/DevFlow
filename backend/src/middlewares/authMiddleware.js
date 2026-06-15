import jwt from "jsonwebtoken";

import AppError from "../utils/AppError.js";

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Unauthorized", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        next(new AppError("Unauthorized", 401));
    }
};