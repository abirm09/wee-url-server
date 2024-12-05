import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp, prisma } from "../../../../app";
import { env } from "../../../../config";
import { RedisClient } from "../../../../shared";

describe("Auth route", () => {
  let app = createApp();

  let refreshToken = "";
  beforeAll(async () => {
    app = createApp(); // Create the app instance before running tests
    await RedisClient.connect();
    await prisma.$connect(); // Connect to the database, if necessary

    // Perform a login request to get access and refresh tokens
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: env.test_admin.email,
      password: env.test_admin.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toEqual({
      statusCode: 200,
      success: true,
      message: "Log in successful",
      data: expect.objectContaining({
        token: expect.stringMatching(
          /^[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+$/
        ),
      }),
    });
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

  describe("POST /auth/login", () => {
    it("should return 400 for invalid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: env.test_admin.email,
        password: "wrong password",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Password didn't match"); // Adjust based on your response
    });

    it("should set refresh token in cookie after login", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: env.test_admin.email,
        password: env.test_admin.password,
      });

      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"]).toBeDefined(); // Check if 'set-cookie' header is defined

      const cookies = response.headers["set-cookie"];

      // Normalize cookies to an array if it's a string
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

      const refreshTokenCookie = cookieArray.find((cookie) =>
        cookie.startsWith("_wee_url=")
      );

      expect(refreshTokenCookie).toBeDefined(); // Ensure the refresh token cookie is set
    });
  });

  //   Access token routes
  describe("GET /auth/access-token", () => {
    it("should get access token using refresh token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/access-token")
        .set("Cookie", `_wee_url=${refreshToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        success: true,
        message: "Access token retrieved successfully",
        data: {
          token: expect.stringMatching(
            /^[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+$/
          ),
        },
      });
    });
  });
});
