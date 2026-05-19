import {
  Request,
  Response,
  NextFunction,
} from "express";

export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(error.statusCode || 500).json({
    success: false,
    message:
      error.message || "Internal Server Error",
  });
};