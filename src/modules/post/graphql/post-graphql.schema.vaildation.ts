import z  from "zod";
export const postValidation = z.object({
    id: z.string().min(1).max(255),
})
