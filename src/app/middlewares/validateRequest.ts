import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessages = error.errors.map((issue: any) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        next(
          new AppError(
            // Bad Request
            `Validation error: ${errorMessages[0].message}`,
            400,
          ),
        );
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
