import { z } from "zod";
import { PaginationValidation } from "../../../../validations";

const getAllForCustomers = z.object({
  query: z.object({
    ...PaginationValidation.query,
    shortCode: z
      .string()
      .max(30, { message: "Short code must contain at most 30 characters" })
      .optional(),
    tags: z
      .union([
        z
          .string()
          .max(20, { message: "Tags must contain at most 20 characters" })
          .optional(),
        z.array(
          z
            .string()
            .max(20, {
              message: "Tags must contain at most 20 characters",
            })
            .optional()
        ),
      ])
      .optional(),
  }),
});

const create = z.object({
  body: z.object({
    url: z.object({
      shortCode: z.string().min(3).max(30).optional(),
      fullUrl: z.string({ required_error: "Full url is required!" }),
      isActive: z.boolean().default(true),
      expiresAt: z
        .preprocess(
          (arg) => (typeof arg === "string" ? new Date(arg) : arg),
          z.date().optional()
        )
        .refine((date) => !date || date > new Date(), {
          message: "Expiration date must be in the future",
        }),
      isPrivate: z.boolean().default(false),
      password: z.string().optional(),
      tags: z.string().array().default([]),
    }),
  }),
});

const update = create.optional();
// const update = z.object({
//   body: z.object({
//     url: z.object({
//       shortCode: z.string().min(3).max(30).optional(),
//       fullUrl: z.string().optional(),
//       isActive: z.boolean().optional(),
//       expiresAt: z
//         .preprocess(
//           (arg) => (typeof arg === "string" ? new Date(arg) : arg),
//           z.date().optional()
//         )
//         .refine((date) => !date || date > new Date(), {
//           message: "Expiration date must be in the future",
//         }),
//       isPrivate: z.boolean().optional(),
//       password: z.string().optional(),
//       tags: z.string().array().optional(),
//     }),
//   }),
// });

export const URLValidation = {
  create,
  update,
  getAllForCustomers,
};
