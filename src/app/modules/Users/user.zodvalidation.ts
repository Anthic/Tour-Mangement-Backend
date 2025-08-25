import z from "zod";
import { UserRole } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s\u0980-\u09FF]+$/,
      "Name can only contain English and Bengali letters with spaces"
    )
    .trim(),

  email: z
    .string()
    .email("Please provide a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain: 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (@$!%*?&)"
    )
    .optional(),

  phone: z
    .string()
    .regex(
      /^(\+8801|01)[3-9]\d{8}$/,
      "Please provide a valid Bangladeshi phone number (e.g., 01712345678 or +8801712345678)"
    )
    .optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters")

    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s\u0980-\u09FF]+$/,
      "Name can only contain English and Bengali letters with spaces"
    )
    .trim()
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain: 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (@$!%*?&)"
    )
    .optional(),

  phone: z
    .string()
    .regex(
      /^(\+8801|01)[3-9]\d{8}$/,
      "Please provide a valid Bangladeshi phone number (e.g., 01712345678 or +8801712345678)"
    )
    .optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters")

    .optional(),

  role: z.enum(Object.values(UserRole) as [string]).optional(),
  isDeleted: z
    .boolean({
      invalid_type_error:
        "isDeleted must be a boolean value like true or false",
    })
    .optional(),
  isActive: z
    .boolean({
      invalid_type_error: "isActive must be a boolean value like true or false",
    })
    .optional(),
  isVerified: z
    .boolean({
      invalid_type_error:
        "isVerified must be a boolean value like true or false",
    })
    .optional(),
});
