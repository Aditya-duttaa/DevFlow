import { z } from "zod";

export const createOrganizationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Organization name must be at least 2 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
});

export const updateOrganizationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Organization name must be at least 2 characters")
        .optional(),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
});

export const addMemberSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email(),

    role: z.enum([
        "ADMIN",
        "MANAGER",
        "DEVELOPER"
    ]).default("DEVELOPER")
});

export const updateMemberRoleSchema = z.object({
    role: z.enum([
        "ADMIN",
        "MANAGER",
        "DEVELOPER"
    ])
});