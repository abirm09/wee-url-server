import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string({ required_error: "NODE_ENV is required" }),
  PORT: z
    .string({ required_error: "PORT is required" })
    .default("5000")
    .refine((val) => Number(val)),
  CLIENT_SIDE_URLS: z.string({
    required_error: "CLIENT_SIDE_URLS is required",
  }),
  REFRESH_TOKEN_SECRET: z.string({
    required_error: "REFRESH_TOKEN_SECRET is required",
  }),
  ACCESS_TOKEN_SECRET: z.string({
    required_error: "ACCESS_TOKEN_SECRET is required",
  }),
  REFRESH_TOKEN_EXPIRES_IN: z.string({
    required_error: "REFRESH_TOKEN_EXPIRES_IN is required",
  }),
  ACCESS_TOKEN_EXPIRES_IN: z.string({
    required_error: "ACCESS_TOKEN_EXPIRES_IN is required",
  }),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  client_side_urls: envVars.CLIENT_SIDE_URLS,
  refresh_token_secret: envVars.REFRESH_TOKEN_SECRET,
  access_token_secret: envVars.ACCESS_TOKEN_SECRET,
  refresh_token_expires_in: envVars.REFRESH_TOKEN_EXPIRES_IN,
  access_token_expires_in: envVars.ACCESS_TOKEN_EXPIRES_IN,
};
