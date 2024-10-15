import { z } from "zod";

const login = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please provide a valid email" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export const AuthValidations = {
  login,
};
