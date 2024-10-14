import { z } from "zod";
import { passwordZodSchema } from "../../../validations/password.Validation";

const create = z.object({
  body: z.object({
    fullName: z.string({ required_error: "Full name is required!" }),
    email: z.string({ required_error: "Email is required!" }).email(),
    password: passwordZodSchema(),
  }),
});

export const UserValidations = {
  create,
};
