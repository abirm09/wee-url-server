import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp, prisma } from "../../../app";
import config from "../../../config";
import { RedisClient } from "../../../shared/redis";

describe("MIDDLEWARE authGuard", () => {
  let app = createApp();
  let accessToken = "";
  let refreshToken = "";
  beforeAll(async () => {
    app = createApp(); // Create the app instance before running tests
    await RedisClient.connect();
    await prisma.$connect(); // Connect to the database, if necessary

    // Perform a login request to get access and refresh tokens
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: config.test_admin.email,
      password: config.test_admin.password,
    });

    expect(loginResponse.status).toBe(200);
    accessToken = `Bearer ${loginResponse.body.data.token}`;

    // Get the refresh token from the 'set-cookie' header
    const cookies = loginResponse.headers["set-cookie"];
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
    refreshToken = cookieArray.find((cookie) => cookie.startsWith("_wee_url="));
    const refreshTokenCookie = cookieArray.find((cookie) =>
      cookie.startsWith("_wee_url=")
    );
    refreshToken = refreshTokenCookie
      ? refreshTokenCookie.split(";")[0].split("=")[1]
      : null;

    expect(refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Disconnect after tests are done
  });

  it("Should return 'Invalid authorization format.' message and 401 status", async () => {
    const response = await request(app).get("/api/v1/user/profile");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid authorization format."
    );
  });

  it("Should return 'Authentication failed.' message and 401 status", async () => {
    const response = await request(app)
      .get("/api/v1/user/profile")
      .set("Authorization", accessToken + "238h980ajds89yy");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Authentication failed.");
  });
});
