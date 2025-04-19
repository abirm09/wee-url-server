import { Router } from "express";
import authGuard from "../../../middlewares/authGuard";
import validateRequest from "../../../middlewares/validateRequest";
import { URLController } from "./url.controller";
import { URLValidation } from "./url.validations";

const router = Router();

/**
 * @swagger
 * /api/v1/url:
 *   post:
 *     summary: Create new url
 *     description: Create url by customers
 *     tags:
 *       - URL
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
 *               url:
 *                 type: object
 *                 properties:
 *                    fullUrl:
 *                      type: string
 *                      example: Free
 *                    shortCode:
 *                      type: string
 *                      example: free
 *                    isActive:
 *                      type: boolean
 *                      example: true
 *                    isPrivate:
 *                      type: boolean
 *                      example: true
 *                    password:
 *                      type: string
 *                      example: strong_password_here
 *                    tags:
 *                      type: array
 *                      items:
 *                        type: string
 *                        example: tag_example
 *     responses:
 *       200:
 *         description: Successful subscription request
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
 *                   example: Url created successfully
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
router.post(
  "/",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(URLValidation.create),
  URLController.create
);

/**
 * @swagger
 * /api/v1/url/customer:
 *   get:
 *     summary: Get all urls by customer
 *     description: Get all url by the customers.
 *     tags:
 *       - URL
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
 *         description: Successful url retrieval
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
 *                   example: All url retrieved successfully.
 *                 meta:
 *                   type: object
 *                   properties:
 *                       total:
 *                         type: number
 *                         example: 100
 *                       page:
 *                         type: number
 *                         example: 1
 *                       limit:
 *                         type: number
 *                         example: 20
 *                       totalPage:
 *                         type: number
 *                         example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: ae8ca84d-ce4f-4b02-9815-6bb79aa9ea07
 *                       shortCode:
 *                         type: string
 *                         example: 832Gh3NKH6i
 *                       fullUrl:
 *                         type: string
 *                         example: https://abirmahmud.top
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: example_tag
 *                       createdAt:
 *                         type: string
 *                         example: 2025-04-04T03:49:48.417Z
 *                       _count:
 *                          type: object
 *                          properties:
 *                              urlMetrics:
 *                                  type: number
 *                                  example: 100
 *
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
router.get(
  "/customer",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(URLValidation.getAllForCustomers),
  URLController.getAllUser
);

/**
 * @swagger
 * /api/v1/url/tags/customer:
 *   get:
 *     summary: Get all tags by customer
 *     description: Get all unique tags by the customers.
 *     tags:
 *       - URL
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
 *         description: Successful tags retrieval
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
 *                   example: All tags retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: example_tag
 *
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
router.get(
  "/tags/customer",
  authGuard({ requiredRoles: ["customer"] }),
  URLController.getUniqueTagsCustomer
);

/**
 * @swagger
 * /api/v1/url/customer/:id:
 *   get:
 *     summary: Get single urls by customer
 *     description: Get single url by the customers.
 *     tags:
 *       - URL
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
 *         description: Successful single url retrieval
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
 *                   example: Url details retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: ae8ca84d-ce4f-4b02-9815-6bb79aa9ea07
 *                     shortCode:
 *                       type: string
 *                       example: 832Gh3NKH6i
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     expiresAt:
 *                       type: string
 *                       example: 2025-04-04T03:49:48.417Z
 *                     fullUrl:
 *                       type: string
 *                       example: https://abirmahmud.top
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: example_tag
 *                     createdAt:
 *                       type: string
 *                       example: 2025-04-04T03:49:48.417Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-04-04T03:49:48.417Z
 *                     password:
 *                       type: string
 *                       example: exist
 *                     _count:
 *                        type: object
 *                        properties:
 *                            urlMetrics:
 *                                type: number
 *                                example: 100
 *
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
router.get(
  "/customer/:id",
  authGuard({ requiredRoles: ["customer"] }),
  URLController.getSingleUrlCustomer
);

export const URLRoutes = router;
