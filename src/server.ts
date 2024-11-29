import { Server } from "http";
import { createApp } from "./app";
import { env } from "./config";
import { RedisClient } from "./shared";
import { Logger } from "./utilities";

const app = createApp();

const bootstrap = async () => {
  await RedisClient.connect();

  const server: Server = app.listen(env.port, () => {
    Logger.console.info(`===${env.env}===`);
    Logger.console.info(`Server is running at http://localhost:${env.port}`);
  });

  const exitHandler = (error: unknown, errorType: string) => {
    if (server) {
      server.close(() => {
        Logger.console.error(errorType, error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown, errorType: string) => {
    Logger.console.error(error);
    exitHandler(error, errorType);
  };

  const uncaughtException = (error: unknown) =>
    unexpectedErrorHandler(error, "Uncaught exception");

  const unhandledRejection = (error: unknown) =>
    unexpectedErrorHandler(error, "Unhandled rejection");

  process.on("uncaughtException", uncaughtException);
  process.on("unhandledRejection", unhandledRejection);

  process.on("SIGTERM", () => {
    Logger.console.error("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

bootstrap();
