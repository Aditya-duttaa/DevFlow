import { z } from "zod";

export const updatePreferenceSchema = z
    .object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        language: z
            .string()
            .trim()
            .min(2)
            .max(20)
            .optional(),
        timezone: z
            .string()
            .trim()
            .min(1)
            .max(100)
            .optional(),
        emailNotifications: z.boolean().optional(),
        taskNotifications: z.boolean().optional(),
        projectNotifications: z.boolean().optional()
    })
    .strict();
