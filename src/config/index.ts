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
  CLIENT_SIDE_DOMAIN: z.string({
    required_error: "CLIENT_SIDE_DOMAIN is required",
  }),
  REFRESH_TOKEN_COOKIE_EXPIRES_IN: z
    .string({
      required_error: "REFRESH_TOKEN_COOKIE_EXPIRES is required",
    })
    .refine((val) => Number(val)),
  GOOGLE_SMTP_USER: z.string({
    required_error: "GOOGLE_SMTP_USER is required",
  }),
  GOOGLE_SMTP_PASS: z.string({
    required_error: "GOOGLE_SMTP_PASS is required",
  }),
  CLOUDINARY_CLOUD_NAME: z.string({
    required_error: "CLOUDINARY_CLOUD_NAME is required",
  }),
  CLOUDINARY_API_KEY: z.string({
    required_error: "CLOUDINARY_API_KEY is required",
  }),
  CLOUDINARY_API_SECRET: z.string({
    required_error: "CLOUDINARY_API_SECRET is required",
  }),
  SUPER_ADMIN_FULL_NAME: z.string({
    required_error: "SUPER_ADMIN_FULL_NAME is required",
  }),
  SUPER_ADMIN_EMAIl: z.string({
    required_error: "SUPER_ADMIN_EMAIl is required",
  }),
  SUPER_ADMIN_PASSWORD: z.string({
    required_error: "SUPER_ADMIN_PASSWORD is required",
  }),
  BCRYPT_SALT_ROUNDS: z
    .string({
      required_error: "BCRYPT_SALT_ROUNDS is required",
    })
    .refine((val) => Number(val)),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  client_side_urls: envVars.CLIENT_SIDE_URLS,
  client_side_domain: envVars.CLIENT_SIDE_DOMAIN,
  refresh_token: {
    secret: envVars.REFRESH_TOKEN_SECRET,
    expires_in: envVars.REFRESH_TOKEN_EXPIRES_IN,
    cookie_expires_in: envVars.REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  },
  access_token: {
    secret: envVars.ACCESS_TOKEN_SECRET,
    expires_in: envVars.ACCESS_TOKEN_EXPIRES_IN,
  },
  google_smtp: {
    user: envVars.GOOGLE_SMTP_USER,
    pass: envVars.GOOGLE_SMTP_PASS,
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  },
  super_admin_data: {
    full_name: envVars.SUPER_ADMIN_FULL_NAME,
    email: envVars.SUPER_ADMIN_EMAIl,
    password: envVars.SUPER_ADMIN_PASSWORD,
  },
  bcrypt_salt_rounds: Number(envVars.BCRYPT_SALT_ROUNDS),
};
