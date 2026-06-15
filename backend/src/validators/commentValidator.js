import { z } from "zod";

export const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(5000, "Comment is too long"),

    taskId: z
        .string()
        .uuid("Invalid task id")
});

export const updateCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(5000, "Comment is too long")
});