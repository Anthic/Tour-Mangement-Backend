import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// 🔢 Fields যেগুলো number হওয়া উচিত (FormData এ string আসে)
const NUMERIC_FIELDS = ["costForm", "maxGuest", "minAge"];

// 📦 Fields যেগুলো array হওয়া উচিত (FormData এ JSON string আসে)  
const ARRAY_FIELDS = ["included", "excluded", "amenities", "tourPlan"];

/**
 * 🛡️ Validation middleware যা FormData থেকে আসা data কে transform করে
 * 
 * কাজ:
 * 1. Detect করে এটা FormData request কিনা
 * 2. String numbers কে actual numbers এ convert করে
 * 3. JSON string arrays কে actual arrays এ parse করে
 * 4. Zod validation চালায়
 */
const validationMiddleware =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 🔍 Check: এটা multipart/form-data request কিনা?
      const isFormData = req.headers["content-type"]?.includes("multipart/form-data");
      
      const transformedBody = { ...req.body };

      // 🔄 যদি FormData হয়, তাহলে transform করো
      if (isFormData) {
        console.log("🔄 FormData detected, transforming data...");
        console.log("📥 Original body:", transformedBody);

        // ✨ Step 1: String numbers কে actual numbers এ convert করো
        NUMERIC_FIELDS.forEach((field) => {
          if (transformedBody[field] !== undefined && transformedBody[field] !== "") {
            const parsed = Number(transformedBody[field]);
            if (!isNaN(parsed)) {
              console.log(`🔢 Converting ${field}: "${transformedBody[field]}" → ${parsed}`);
              transformedBody[field] = parsed;
            }
          }
        });

        // ✨ Step 2: JSON string arrays কে actual arrays এ parse করো
        ARRAY_FIELDS.forEach((field) => {
          if (typeof transformedBody[field] === "string") {
            try {
              const parsed = JSON.parse(transformedBody[field]);
              console.log(`📦 Parsing ${field}:`, parsed);
              transformedBody[field] = parsed;
            } catch (e) {
              // যদি parse fail করে, single item array বানাও
              console.log(`⚠️ Failed to parse ${field}, converting to array`,e);
              if (transformedBody[field]) {
                transformedBody[field] = [transformedBody[field]];
              }
            }
          }
        });

        console.log("✅ Transformed body:", transformedBody);
      }

      // ✅ Zod validation চালাও transformed data দিয়ে
      const validatedData = await zodSchema.parseAsync({
        body: transformedBody,
        query: req.query,
        params: req.params,
      });

      // ✅ Request body update করো validated data দিয়ে
      if (validatedData.body) {
        req.body = validatedData.body;
      }

      next();
    } catch (error) {
      // ❌ যদি error হয়, global error handler এ পাঠাও
      next(error);
    }
  };

// ✅ দুটো নামেই export করো (backward compatibility)
export const validateFormData = validationMiddleware;
