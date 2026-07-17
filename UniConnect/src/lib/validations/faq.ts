import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial();

export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
