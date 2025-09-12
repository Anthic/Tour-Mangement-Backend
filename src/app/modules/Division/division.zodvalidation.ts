import { z } from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .transform((val) => val.trim()),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
  thumbnail: z.string().url("Invalid URL").optional(),
  discription: z
    .string()
    .min(10, "Description too short")
    .max(500, "Description too long")
    .optional(),
});
