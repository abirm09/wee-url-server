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
  CLIENT_SIDE_URLS: z.preprocess(
    (val) => JSON.parse(val as string),
    z.array(z.string())
  ),
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
    .default("12")
    .refine((val) => Number(val)),
  MAX_DEVICE_LOGIN_LIMIT: z
    .string({
      required_error: "MAX_DEVICE_LOGIN_LIMIT is required",
    })
    .default("4"),
  TEST_ADMIN_PASSWORD: z.string().optional(),
  TEST_ADMIN_EMAIL: z.string().optional(),
  REDIS_URL: z.string({ required_error: "REDIS_URL is required" }),
  STRIPE_PUBLISHABLE_KEY: z.string({
    required_error: "STRIPE_PUBLISHABLE_KEY is required",
  }),
  STRIPE_SECRET_KEY: z.string({
    required_error: "STRIPE_SECRET_KEY is required",
  }),
  IP_INFO_TOKEN: z.string({
    required_error: "IP_INFO_TOKEN is required",
  }),
  STRIPE_ENDPOINT_SECRET: z.string({
    required_error: "STRIPE_ENDPOINT_SECRET is required",
  }),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: parseInt(envVars.PORT),
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
  bcrypt_salt_rounds: parseInt(envVars.BCRYPT_SALT_ROUNDS),
  max_device_login_limit: parseInt(envVars.MAX_DEVICE_LOGIN_LIMIT),
  test_admin: {
    email: String(envVars.TEST_ADMIN_EMAIL),
    password: String(envVars.TEST_ADMIN_PASSWORD),
  },
  redis_url: envVars.REDIS_URL,
  stripe: {
    stripe_publishable_key: envVars.STRIPE_PUBLISHABLE_KEY,
    stripe_secret_key: envVars.STRIPE_SECRET_KEY,
    stripe_endpoint_secret: envVars.STRIPE_ENDPOINT_SECRET,
  },
  ip_info: {
    token: envVars.IP_INFO_TOKEN,
  },
};
