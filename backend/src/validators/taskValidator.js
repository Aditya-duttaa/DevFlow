import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Task title must be at least 2 characters"),

    description: z
        .string()
        .trim()
        .max(2000, "Description cannot exceed 2000 characters")
        .optional(),

    projectId: z
        .string()
        .uuid("Invalid project id"),

    assigneeId: z
        .string()
        .uuid("Invalid assignee id")
        .optional()
});

export const updateTaskStatusSchema = z.object({
    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "IN_REVIEW",
        "DONE"
    ])
});

export const assignTaskSchema = z.object({
    assigneeId: z
        .string()
        .uuid("Invalid assignee id")
});

export const updateTaskSchema = z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional()
});
