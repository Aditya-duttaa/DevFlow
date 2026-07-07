import { z } from "zod";

export const updateProfileSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name cannot exceed 100 characters")
            .optional(),

        avatarUrl: z
            .preprocess(
                (value) => (value === "" ? null : value),
                z.union([
                    z
                        .string()
                        .trim()
                        .url("Avatar URL must be a valid URL"),
                    z.null()
                ]).optional()
            )
    })
    .strict();

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),

        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters")
            .max(128, "New password cannot exceed 128 characters")
            .regex(/[A-Z]/, "New password must include an uppercase letter")
            .regex(/[a-z]/, "New password must include a lowercase letter")
            .regex(/[0-9]/, "New password must include a number")
            .regex(
                /[^A-Za-z0-9]/,
                "New password must include a special character"
            ),

        confirmPassword: z.string()
    })
    .strict()
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Confirm password must match new password"
        }
    );
