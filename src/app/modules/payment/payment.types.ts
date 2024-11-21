import { Payment } from "@prisma/client";

export type PaymentInput = Omit<Payment, "id" | "createdAt" | "updatedAt">;
