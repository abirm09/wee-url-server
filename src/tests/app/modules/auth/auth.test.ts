import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp, prisma } from "../../../../app";
import config from "../../../../config";

describe("Auth route", () => {
  let app = createApp();

  beforeAll(async () => {
    app = createApp(); // Create the app instance before running tests
    await prisma.$connect(); // Connect to the database, if necessary
  });

  afterAll(async () => {
    await prisma.$disconnect(); // Disconnect after tests are done
  });

  describe("POST /auth/login", () => {
    it("should login a user", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: config.test_admin.email,
        password: config.test_admin.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        success: true,
        message: "Log in successful",
        data: expect.objectContaining({
          token: expect.stringMatching(
            /^[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+$/
          ),
        }),
      });
    });

    it("should return 400 for invalid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: config.test_admin.email,
        password: "wrong password",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Password didn't match"); // Adjust based on your response
    });

    it("should set refresh token in cookie after login", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: config.test_admin.email,
        password: config.test_admin.password,
      });

      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"]).toBeDefined(); // Check if 'set-cookie' header is defined

      const cookies = response.headers["set-cookie"];

      // Normalize cookies to an array if it's a string
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

      const refreshTokenCookie = cookieArray.find((cookie) =>
        cookie.startsWith("we_url_t=")
      );

      expect(refreshTokenCookie).toBeDefined(); // Ensure the refresh token cookie is set
    });
  });

  //   Access token routes
  describe("GET /auth/access-token", () => {
    it("should get access token using refresh token from cookie", async () => {
      const refreshToken = config.test_admin.refresh_token;
      const response = await request(app)
        .get("/api/v1/auth/access-token")
        .set("Cookie", `we_url_t=${refreshToken}`);

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

    // it("should return 400 for invalid request", async () => {});
  });
});
