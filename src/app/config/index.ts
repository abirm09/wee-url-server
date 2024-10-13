import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default("5000")
    .refine((val) => Number(val)),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};
