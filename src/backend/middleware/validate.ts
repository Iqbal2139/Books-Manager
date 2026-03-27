import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.issues });
      }
      next(error);
    }
  };
};

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  year: z.number().int().min(1000).max(new Date().getFullYear()),
});

export const authSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
