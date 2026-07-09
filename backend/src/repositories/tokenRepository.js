import prisma from "../config/prisma.js";

export const createRefreshToken = async (data) => {
    return prisma.refreshToken.create({
        data
    });
};

export const findRefreshTokenByHash = async (tokenHash) => {
    return prisma.refreshToken.findUnique({
        where: {
            tokenHash
        },
        include: {
            user: true
        }
    });
};

export const revokeRefreshTokenByHash = async (tokenHash) => {
    return prisma.refreshToken.updateMany({
        where: {
            tokenHash,
            revokedAt: null
        },
        data: {
            revokedAt: new Date()
        }
    });
};

export const revokeAllRefreshTokensByUserId = async (userId) => {
    return prisma.refreshToken.updateMany({
        where: {
            userId,
            revokedAt: null
        },
        data: {
            revokedAt: new Date()
        }
    });
};

export const revokeAllRefreshTokensExceptHash = async (
    userId,
    tokenHash
) => {
    return prisma.refreshToken.updateMany({
        where: {
            userId,
            revokedAt: null,
            tokenHash: {
                not: tokenHash
            }
        },
        data: {
            revokedAt: new Date()
        }
    });
};
