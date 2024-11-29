/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { TJWTPayload } from "./types";

declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
      userIp?: string;
      fileValidationError?: string;
    }
  }
}
