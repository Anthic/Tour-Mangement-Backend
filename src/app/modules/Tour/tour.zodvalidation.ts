import z from "zod";

export const createTourZodSchema = z.object({
  body: z.object({
    // ✅ Required string fields
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    
    tourType: z.string().min(1, "Tour type is required"),
    division: z.string().min(1, "Division is required"),

    // ✅ Optional string fields  
    description: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),

    // ✅ Numeric fields (middleware দ্বারা convert হয়ে আসবে)
    costForm: z
      .number({ invalid_type_error: "Cost must be a number" })
      .positive("Cost must be positive")
      .optional(),
    
    maxGuest: z
      .number({ invalid_type_error: "Max guest must be a number" })
      .int("Max guest must be an integer")
      .positive("Max guest must be positive")
      .optional(),
    
    minAge: z
      .number({ invalid_type_error: "Minimum age must be a number" })
      .int("Minimum age must be an integer")
      .min(0, "Minimum age cannot be negative")
      .optional(),

    // ✅ Array fields (middleware দ্বারা parse হয়ে আসবে)
    included: z
      .array(z.string())
      .optional()
      .default([]),
    
    excluded: z
      .array(z.string())
      .optional()
      .default([]),
    
    amenities: z
      .array(z.string())
      .optional()
      .default([]),
    
    tourPlan: z
      .array(z.string())
      .optional()
      .default([]),
  }),
});

// Update এর জন্য same pattern
export const updateTourZodSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    slug: z.string().optional(),
    image: z.array(z.string()).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    
    // Number fields
    costFrom: z.number().positive().optional(),
    maxGuest: z.number().int().positive().optional(),
    minAge: z.number().int().min(0).optional(),
    
    // Date fields
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    
    // Array fields
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    
    // Reference fields
    division: z.string().optional(),
    tourType: z.string().optional(),
  }),
});

export const createTourTypeZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(50),
  }),
});

export const updateTourTypeZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Tour type name is required")
      .max(50, "Tour type name must not exceed 50 characters"),
  }),
});