import nodemailer from "nodemailer";

const getTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 2525),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER
            ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS
              }
            : undefined
    });
};

const getFromAddress = () => {
    return (
        process.env.MAIL_FROM ||
        "DevFlow <no-reply@devflow.local>"
    );
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

    await getTransporter().sendMail({
        from: getFromAddress(),
        to: email,
        subject: "Reset your DevFlow password",
        text: `Reset your password using this link: ${resetUrl}`,
        html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`
    });
};

export const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${token}`;

    await getTransporter().sendMail({
        from: getFromAddress(),
        to: email,
        subject: "Verify your DevFlow email",
        text: `Verify your email using this link: ${verifyUrl}`,
        html: `<p>Verify your email using this link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`
    });
};
