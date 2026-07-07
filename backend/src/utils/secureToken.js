import crypto from "node:crypto";

export const generateSecureToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

export const addMinutes = (minutes) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

export const addHours = (hours) => {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
};
