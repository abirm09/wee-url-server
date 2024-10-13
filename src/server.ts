import { Server } from "http";
import app from "./app";
import config from "./config";
import { logger } from "./utilities/logger/logger";

const bootstrap = async () => {
  const server: Server = app.listen(config.port, () => {
    logger.console.info(`===${config.env}===`);
    logger.console.info(`Server is running at http://localhost:${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.console.info(`Server closed`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  const unexpectedErrorHandler = (error: unknown) => {
    logger.console.info(error);
    exitHandler();
  };

  const unhandledRejection = (error: unknown) => unexpectedErrorHandler(error);

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unhandledRejection);

  process.on("SIGTERM", () => {
    logger.console.info("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

bootstrap();
