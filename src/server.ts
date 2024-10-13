/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import config from "./app/config";

const bootstrap = async () => {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log(`Server closed`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  const unexpectedErrorHandler = (error: unknown) => {
    console.log(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

bootstrap();
