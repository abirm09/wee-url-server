import { User } from "@prisma/client";

export type TJWTPayload = {
  userId: string;
  role: string;
  tokenId: string;
  user?: User;
};
