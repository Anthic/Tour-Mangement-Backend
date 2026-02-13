import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validationUser =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the entire request object (body, query, params)
      const validatedData = await zodSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = validatedData;
      // Update request with validated data (only body can be reassigned)
      if (validatedData.body) {
        req.body = validatedData.body;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
