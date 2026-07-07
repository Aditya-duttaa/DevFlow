import prisma from "../config/prisma.js";

export const deleteExpiredPasswordResetTokens = async () => {
    return prisma.passwordResetToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    });
};

export const revokeActivePasswordResetTokens = async (userId) => {
    return prisma.passwordResetToken.updateMany({
        where: {
            userId,
            usedAt: null,
            expiresAt: {
                gt: new Date()
            }
        },
        data: {
            usedAt: new Date()
        }
    });
};

export const createPasswordResetToken = async (data) => {
    return prisma.passwordResetToken.create({
        data
    });
};

export const findPasswordResetTokenByHash = async (tokenHash) => {
    return prisma.passwordResetToken.findUnique({
        where: {
            tokenHash
        },
        include: {
            user: true
        }
    });
};

export const markPasswordResetTokenUsed = async (id) => {
    return prisma.passwordResetToken.update({
        where: {
            id
        },
        data: {
            usedAt: new Date()
        }
    });
};

export const deletePasswordResetTokenById = async (id) => {
    return prisma.passwordResetToken.delete({
        where: {
            id
        }
    });
};

export const deleteExpiredEmailVerificationTokens = async () => {
    return prisma.emailVerificationToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    });
};

export const revokeActiveEmailVerificationTokens = async (userId) => {
    return prisma.emailVerificationToken.updateMany({
        where: {
            userId,
            usedAt: null,
            expiresAt: {
                gt: new Date()
            }
        },
        data: {
            usedAt: new Date()
        }
    });
};

export const createEmailVerificationToken = async (data) => {
    return prisma.emailVerificationToken.create({
        data
    });
};

export const findEmailVerificationTokenByHash = async (tokenHash) => {
    return prisma.emailVerificationToken.findUnique({
        where: {
            tokenHash
        },
        include: {
            user: true
        }
    });
};

export const markEmailVerificationTokenUsed = async (id) => {
    return prisma.emailVerificationToken.update({
        where: {
            id
        },
        data: {
            usedAt: new Date()
        }
    });
};

export const deleteEmailVerificationTokenById = async (id) => {
    return prisma.emailVerificationToken.delete({
        where: {
            id
        }
    });
};

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
