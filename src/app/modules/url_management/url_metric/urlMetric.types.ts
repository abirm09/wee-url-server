import { UrlMetrics } from "@prisma/client";

export type TUrlMetricInput = Omit<
  UrlMetrics,
  "id" | "createdAt" | "accessedOn"
>;

export type TUrlMetricFilterableField = {
  accessedOnFrom?: string;
  accessedOnTo?: string;
  accessedDeviceType?: string;
};

export type TUrlClickCountFilterableFields = {
  from?: string;
  to?: string;
  accessedDeviceType?: string;
  accessedFromCountry?: string;
};
