import { Response } from 'express';

export const sendSuccessResponse = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string = 'Internal server error',
  statusCode: number = 500,
  error: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error && process.env.NODE_ENV !== 'production' ? error.toString() : undefined,
  });
}; 