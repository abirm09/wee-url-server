/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { TJWTPayload } from "./jwt/payload";

declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
      userIp?: string;
      fileValidationError?: string;
    }
  }
}
