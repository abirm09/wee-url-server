/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { TJWTPayload } from "./jwt/payload";
import TUserAgent from "./userAgent";

declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
      userAgent?: TUserAgent;
      userIp?: string;
      fileValidationError?: string;
    }
  }
}
