import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "WeeURL API documentation",
      version: "0.1.0",
      description: "Wee URL, an url shorter application.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Abir Mahmud",
        url: "https://abirmahmud.top",
        email: "abirmahmud5665@gmail.com",
      },
    },
    servers: env.server_urls,
  },
  apis: ["src/app/modules/**/*.{routes}.ts", "src/app/modules/**/*.ts"],
};

export const specs = swaggerJsdoc(options);
