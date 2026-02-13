import { z } from "zod";

//  For create - make schema more forgiving
export const createDivisionSchema = z
  .object({
    name: z
      .string({
        required_error: "Division name is required",
      })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long")
      .transform((val) => val?.trim() || ""),
    
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional()
      .or(z.literal(""))
      .default(""),
  })
  .passthrough(); 

// For update - all fields optional
export const updateDivisionSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long")
      .transform((val) => val?.trim() || "")
      .optional(),
    
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional()
      .or(z.literal(""))
      .default(""),
  })
  .passthrough();