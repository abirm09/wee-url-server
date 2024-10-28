import { UserAccountStatus, UsersRole } from "@prisma/client";

export type TJWTPayload = {
  userId: string;
  role: string;
  tokenId: string;
  user?: {
    isEmailVerified: boolean;
    needsPasswordChange: boolean;
    role: UsersRole;
    status: UserAccountStatus;
    email: string;
    loggedInDevices: {
      isBlocked: boolean;
    }[];
  } | null;
};
