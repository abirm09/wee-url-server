import { z } from "zod";
import { passwordZodSchema } from "../../../validations/password.Validation";

const create = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required!" })
      .max(150, "Full name must be at most 150 characters long"),
    email: z
      .string({ required_error: "Email is required!" })
      .email()
      .max(254, "Email must be at most 254 characters long"),
    password: passwordZodSchema(),
  }),
});

const update = z.object({
  body: z.object({
    user: z
      .object({
        fullName: z
          .string()
          .max(150, "Full name must be at most 150 characters long")
          .optional(),
        email: z
          .string()
          .email()
          .max(254, "Email must be at most 254 characters long")
          .optional(),
      })
      .optional(),
    profile: z.object({
      picture: z.string().optional(),
      picPublicId: z.string().optional(),
    }),
  }),
});

export const UserValidations = {
  create,
  update,
};
