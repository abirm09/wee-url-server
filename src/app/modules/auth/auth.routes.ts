import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import rateLimit from "../../middlewares/rateLimit";
import userIp from "../../middlewares/userIp";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./auth.validations";

const route = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user, returns a token and profile data.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Log in successful
 *                 data:
 *                   type: object
 *                   properties:
 *                      token:
 *                         type: string
 *                         example: token.example
 *                      profile:
 *                         type: object
 *                         properties:
 *                            id:
 *                              type: string
 *                              example: 142279c2-90ff-4427-8ba3-d119dd723420
 *                            fullName:
 *                              type: string
 *                              example: MD Abir Mahmud
 *                            userId:
 *                              type: string
 *                              example: 2532948181
 *                            email:
 *                              type: string
 *                              example: abirmahmud5665@gmail.com
 *                            isEmailVerified:
 *                              type: boolean
 *                              example: true
 *                            needsPasswordChange:
 *                              type: boolean
 *                              example: false
 *                            role:
 *                              type: string
 *                              example: customer
 *                            status:
 *                              type: boolean
 *                              example: true
 *                            subscriptions:
 *                               type: array
 *                               items:
 *                                  type: object
 *                                  properties:
 *                                     plan:
 *                                       type: object
 *                                       properties:
 *                                          id:
 *                                            type: string
 *                                            example: 14be453c-e0f8-4fb0-8bd4-fe722b58cbe7
 *                                          name:
 *                                            type: string
 *                                            example: Free
 *                                          type:
 *                                              type: string
 *                                              example: free
 *                            profile:
 *                              type: object
 *                              properties:
 *                                  picture:
 *                                      type: string
 *                                      example: http://res.cloudinary.com/asa7shda/asr34f/sdfsdf.jpg
 *       400:
 *         description: Same structure for every error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Same structure for every error
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: ""
 *                       message:
 *                         type: string
 *                         example: Same structure for every error
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.post(
  "/login",
  rateLimit(5),
  validateRequest(AuthValidations.login),
  userIp,
  AuthController.login
);

/**
 * @swagger
 * /api/v1/auth/access-token:
 *   get:
 *     summary: Get access token
 *     description: Get new access token.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: cookie
 *         name: _wee_url
 *         schema:
 *           type: string
 *         required: true
 *         description: Refresh token
 *         example: jwt.token
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Access token retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                      token:
 *                         type: string
 *                         example: token.example
 *       400:
 *         description: Same structure for every error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Same structure for every error
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: ""
 *                       message:
 *                         type: string
 *                         example: Same structure for every error
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.get(
  "/access-token",
  rateLimit(5),
  validateRequest(AuthValidations.accessToken),
  AuthController.accessToken
);

/**
 * @swagger
 * /api/v1/auth/email-verify-request:
 *   get:
 *     summary: Email verify request
 *     description: Send email verify request
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: Successful email sending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verification email sended successfully
 *       400:
 *         description: Same structure for every error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Same structure for every error
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: ""
 *                       message:
 *                         type: string
 *                         example: Same structure for every error
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.post(
  "/email-verify-request",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
  }),
  AuthController.createVerifyEmailRequest
);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify email
 *     description: Verify email
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: Successful email verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verification successful
 *       400:
 *         description: Same structure for every error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Same structure for every error
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: ""
 *                       message:
 *                         type: string
 *                         example: Same structure for every error
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.post(
  "/verify-otp",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
  }),
  AuthController.verifyOtp
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out user
 *     description: Log out a user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successfully
 *       400:
 *         description: Same structure for every error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Same structure for every error
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: ""
 *                       message:
 *                         type: string
 *                         example: Same structure for every error
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.post(
  "/logout",
  rateLimit(5),
  authGuard({
    validateIsEmailVerified: false,
  }),
  AuthController.logout
);

export const AuthRoutes = route;
