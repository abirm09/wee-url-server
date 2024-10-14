import compression from "compression";
import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFoundHandler } from "./app/middlewares/notFoundHandler";
import router from "./app/routes";
import config from "./config";

// App Instance
const app: Application = express();

const corsOptions: CorsOptions = {
  origin: config.client_side_urls?.split(","),
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

if (config.env === "production") {
  app.set("trust proxy", 1);
}

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(compression());
if (config.env === "development") {
  app.use(morgan("dev"));
}

app.get("/", async (req, res) => {
  res.status(301).redirect("https://weeurl.abirmahmud.top");
});

// API routes

app.use("/api/v1", router);

// Global error handler
app.use(globalErrorHandler);

// handle not found route
app.use(notFoundHandler);

export default app;
