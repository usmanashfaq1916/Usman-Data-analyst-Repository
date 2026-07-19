import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional(),
  coverUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.enum(["ADMISSIONS", "SCHOLARSHIPS", "CAREER", "TECHNOLOGY", "STUDY_TIPS", "AI", "GENERAL"]).default("GENERAL"),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
