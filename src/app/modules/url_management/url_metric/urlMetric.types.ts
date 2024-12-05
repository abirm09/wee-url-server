import { UrlMetrics } from "@prisma/client";

export type TUrlMetricInput = Omit<
  UrlMetrics,
  "id" | "createdAt" | "accessedOn"
>;
