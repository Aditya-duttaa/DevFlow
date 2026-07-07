import { z } from "zod";

export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters"),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required")
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
});

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password cannot exceed 128 characters")
            .regex(/[A-Z]/, "Password must include an uppercase letter")
            .regex(/[a-z]/, "Password must include a lowercase letter")
            .regex(/[0-9]/, "Password must include a number")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must include a special character"
            ),
        confirmPassword: z.string()
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Confirm password must match"
        }
    );

export const resendVerificationSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
});
