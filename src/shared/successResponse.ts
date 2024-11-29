import { Response } from "express";

type IApiResponse<T> = {
  statusCode: number;
  success?: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

export const successResponse = <T>(
  res: Response,
  data: IApiResponse<T>
): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: true,
    message: data.message,
    meta: data.meta || undefined,
    data: data.data || undefined,
  };

  res.status(data.statusCode).json(responseData);
};
