import { Request, Response, NextFunction } from 'express';
// eslint error typescript instant fix:
// ----------------------------------------------------------------->
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'The requested resource was not found',
      },
    ],
  });
};
export default notFound;
