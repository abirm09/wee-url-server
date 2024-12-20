import { z } from "zod";
import { env } from "../../../config";

const login = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please provide a valid email" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const accessToken = z.object({
  cookies: z.object({
    [env.cookieNames.accessToken]: z.string({
      required_error: "Invalid request",
    }),
  }),
});

export const AuthValidations = {
  login,
  accessToken,
};
