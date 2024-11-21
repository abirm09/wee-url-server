import { LoggedInDevice } from "@prisma/client";

export type LoggedInDeviceInput = Omit<
  LoggedInDevice,
  "id" | "createdAt" | "updatedAt"
>;
