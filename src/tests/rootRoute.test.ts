// app.test.js
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import config from "../config";

const app = createApp();

describe("GET /", () => {
  it("should respond with a 301 status and redirect to the specified URL", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(config.client_side_urls[0]);
  });
});
