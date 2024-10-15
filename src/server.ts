import { Server } from "http";
import app from "./app";
import config from "./config";
import { logger } from "./utilities/logger/logger";

const bootstrap = async () => {
  const server: Server = app.listen(config.port, () => {
    logger.console.info(`===${config.env}===`);
    logger.console.info(`Server is running at http://localhost:${config.port}`);
  });

  const exitHandler = (error: unknown, errorType: string) => {
    if (server) {
      server.close(() => {
        logger.console.info(errorType, error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  const unexpectedErrorHandler = (error: unknown, errorType: string) => {
    logger.console.info(error);
    exitHandler(error, errorType);
  };
  const uncaughtException = (error: unknown) =>
    unexpectedErrorHandler(error, "Uncaught exception");

  const unhandledRejection = (error: unknown) =>
    unexpectedErrorHandler(error, "Unhandled rejection");

  process.on("uncaughtException", uncaughtException);
  process.on("unhandledRejection", unhandledRejection);

  process.on("SIGTERM", () => {
    logger.console.info("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

bootstrap();
