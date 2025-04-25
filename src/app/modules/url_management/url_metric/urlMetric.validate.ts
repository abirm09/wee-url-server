import { z } from "zod";

const statBreakdown = z.object({
  query: z.object({
    filterType: z.enum(["daily", "monthly"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    timeZone: z.string().optional(),
  }),
});

export const UrlMetricValidation = { statBreakdown };
