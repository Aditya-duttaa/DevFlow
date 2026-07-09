import { z } from "zod";

export const createAttachmentSchema = z.object({
    taskId: z.string().uuid("Invalid task id")
});
