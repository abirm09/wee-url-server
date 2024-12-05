import { PrismaClient } from "@prisma/client";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFoundHandler } from "./app/middlewares/notFoundHandler";
import userIp from "./app/middlewares/userIp";
import { RedirectController } from "./app/modules/redirect/redirect.controller";
import router from "./app/routes";
import { env } from "./config";
import { WebhookRoutes } from "./web_hooks/routes";

// Create an instance of PrismaClient
export const prisma = new PrismaClient();

// Function to create and configure the Express application
export const createApp = (): Application => {
  // App Instance
  const app: Application = express();

  const corsOptions: CorsOptions = {
    origin: env.client_side_urls,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  };

  if (env.env === "production") {
    app.set("trust proxy", 1);
  }

  // Middlewares
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(userIp);
  if (env.env === "development") {
    app.use(morgan("dev"));
  }

  // Webhooks
  app.use(
    "/api/v1/webhook",
    express.raw({ type: "application/json" }),
    WebhookRoutes
  );

  app.use(express.json());

  // Static assets
  app.use(express.static("public"));

  // Url redirect middleware
  app.use(RedirectController.redirect);

  // VIew engin config
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  // Favicon route
  app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "favicon.ico"));
  });

  // Root route
  app.get("/", (req, res) => {
    res.status(301).redirect(env.client_side_urls[0]);
  });

  // API routes
  app.use("/api/v1", router);

  // Global error handler
  app.use(globalErrorHandler);

  // Handle not found route
  app.use(notFoundHandler);

  return app; // Return the configured app instance
};
