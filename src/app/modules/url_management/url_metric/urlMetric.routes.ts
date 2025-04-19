import { Router } from "express";
import authGuard from "../../../middlewares/authGuard";
import { UrlMetricController } from "./urlMetric.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/url-metric/customer/click-count:id:
 *   get:
 *     summary: Get urls metric
 *     description: Get all url click information
 *     tags:
 *       - URL metrics
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token on authorization header
 *         example: Bearer jwt.token
 *       - in: path
 *         name: url id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer
 *       - in: query
 *         name: accessedDeviceType
 *         schema:
 *           type: string
 *           example: desktop
 *         description: Type of device (e.g., desktop, mobile)
 *       - in: query
 *         name: accessedOnFrom
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-04-17T01:31:37.686Z
 *         description: Start date-time of access filter
 *       - in: query
 *         name: accessedOnTo
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-04-16T19:31:37.686Z
 *         description: End date-time of access filter
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
 *                   example: Url click count retrieved successfully!
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
 *                       urlId:
 *                         type: string
 *                         example: dfbc446a-17ac-4ddc-a965-6f412ee47395
 *                       accessedFromIp:
 *                         type: string
 *                         example: 192.168.0.1
 *                       accessedFromCity:
 *                         type: string
 *                         example: Satkhira
 *                       accessedFromCountry:
 *                         type: string
 *                         example: Bangladesh
 *                       accessedOn:
 *                         type: string
 *                         example: 2025-04-04T03:49:48.417Z
 *                       userAgent:
 *                         type: string
 *                         example: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
 *                       accessedDeviceType:
 *                         type: string
 *                         example: desktop | smartphone | tablet | television | camera | car | console | phablet | wearable | peripheral | smart display | portable media player | smart speaker | feature phone
 *                       isBot:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         example: 2025-04-04T03:49:48.417Z
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
  "/customer/click-count/:id",
  authGuard({ requiredRoles: ["customer"] }),
  UrlMetricController.getUrlClicksCountCustomers
);

/**
 * @swagger
 * /api/v1/url-metric/customer/:id:
 *   get:
 *     summary: Get all tags by customer
 *     description: Get all unique tags by the customers.
 *     tags:
 *       - URL metrics
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token on authorization header
 *         example: Bearer jwt.token
 *       - in: path
 *         name: url id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer
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
 *                   example: Url click count retrieved successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                       count:
 *                         type: number
 *                         example: 10
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
  UrlMetricController.get
);

export const UrlMetricRoutes = router;
