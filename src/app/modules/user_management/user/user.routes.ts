import { Router } from "express";
import { Upload } from "../../../../config";
import authGuard from "../../../middlewares/authGuard";
import rateLimit from "../../../middlewares/rateLimit";
import validateRequest from "../../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserMiddlewares } from "./user.middlewares";
import { UserValidations } from "./user.validations";

const route = Router();

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Create user account
 *     description: Create new user account
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 fullName:
 *                     type: string
 *                     example: Test user
 *                 email:
 *                     type: string
 *                     example: user@email.com
 *                 password:
 *                     type: string
 *                     example: Strong password here
 *     responses:
 *       201:
 *         description: Successful user creation
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
 *                   example: User created successfully
 *       400:
 *         description: This template is generic for any error
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
 *                   example: Error message
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: Path name here
 *                       message:
 *                         type: string
 *                         example: Specific path error message
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.post(
  "/",
  rateLimit(5),
  validateRequest(UserValidations.create),
  UserController.create
);

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get user profile
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token on authorization header
 *         example: Bearer jwt.token
 *     responses:
 *       200:
 *         description: Successful profile retrieval
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
 *                   example: Profile retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 142279c2-90ff-4427-8ba3-d119dd723420
 *                     fullName:
 *                       type: string
 *                       example: Tamim khan
 *                     userId:
 *                       type: string
 *                       example: 2532948181
 *                     email:
 *                       type: string
 *                       example: gireto7027@deenur.com
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: true
 *                     needsPasswordChange:
 *                       type: boolean
 *                       example: false
 *                     role:
 *                       type: string
 *                       example: customer
 *                     status:
 *                       type: string
 *                       example: active
 *                     subscriptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           plan:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: 14be453c-e0f8-4fb0-8bd4-fe722b58cbe7
 *                               name:
 *                                 type: string
 *                                 example: Free
 *                               type:
 *                                 type: string
 *                                 example: free
 *                     profile:
 *                       type: object
 *                       properties:
 *                         picture:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *       400:
 *         description: This template is generic for any error
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
 *                   example: Error message
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: Path name here
 *                       message:
 *                         type: string
 *                         example: Specific path error message
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */

route.get(
  "/profile",
  rateLimit(50, 50),
  authGuard({
    requiredRoles: ["admin", "customer"],
    validateIsEmailVerified: false,
    validateMaxDeviceLimit: false,
  }),
  UserController.profile
);

/**
 * @swagger
 * /api/v1/user:
 *   patch:
 *     summary: Update user profile
 *     description: Update user profile
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token on authorization header
 *         example: Bearer jwt.token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 fullName:
 *                     type: string
 *                     example: Test user
 *                 image:
 *                     type: file
 *                     example: Strong password here
 *     responses:
 *       201:
 *         description: Successful user creation
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
 *                   example: User updated successfully successfully
 *       400:
 *         description: This template is generic for any error
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
 *                   example: Error message
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: Path name here
 *                       message:
 *                         type: string
 *                         example: Specific path error message
 *                 stack:
 *                   type: string
 *                   example: Error same structure for every error match\n as path/to/file.ts
 */
route.patch(
  "/",
  rateLimit(5),
  authGuard({
    requiredRoles: ["admin", "customer"],
  }),
  Upload.userProfilePictures.single("image"),
  UserMiddlewares.convertUpdateProfileFormDataToObject,
  validateRequest(UserValidations.update),
  UserController.updateUser
);

export const UserRoutes = route;
