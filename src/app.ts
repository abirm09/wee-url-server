import { PrismaClient } from "@prisma/client";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFoundHandler } from "./app/middlewares/notFoundHandler";
import userAgent from "./app/middlewares/userAgent";
import router from "./app/routes";
import config from "./config";
// Create an instance of PrismaClient
export const prisma = new PrismaClient();

// Function to create and configure the Express application
export const createApp = (): Application => {
  // App Instance
  const app: Application = express();

  const corsOptions: CorsOptions = {
    origin: config.client_side_urls,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  };

  if (config.env === "production") {
    app.set("trust proxy", 1);
  }

  // Middlewares
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(helmet());
  app.use(express.json());
  app.use(compression());
  if (config.env === "development") {
    app.use(morgan("dev"));
  }

  app.get("/", userAgent, (req, res) => {
    res.status(301).redirect(config.client_side_urls[0]);
  });

  // API routes
  app.use("/api/v1", router);

  // Global error handler
  app.use(globalErrorHandler);

  // Handle not found route
  app.use(notFoundHandler);

  return app; // Return the configured app instance
};
