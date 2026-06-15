import { z } from "zod";

export const createAttachmentSchema = z.object({
    fileName: z.string().trim().min(1),
    fileUrl: z.string().url("Invalid file URL"),
    fileType: z.string().optional(),
    fileSize: z.number().int().positive().optional(),
    taskId: z.string().uuid("Invalid task id")
});