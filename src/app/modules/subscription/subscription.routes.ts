import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validations";

const route = Router();

/**
 * @swagger
 * /api/v1/subscription/calculate-subscription-amount:
 *   post:
 *     summary: Calculate subscription amount
 *     description: Calculate subscription plan and return subscription amount
 *     tags:
 *       - Subscription
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
 *               planId:
 *                 type: string
 *                 example: 588bfc26-8d1e-4bb8-9ad8-d35881744dbb
 *               billingPeriodId:
 *                 type: string
 *                 example: 4280a172-aa88-4c35-9972-1440f7d90dae
 *     responses:
 *       200:
 *         description: Successful calculation
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
 *                   example: Retrieved subscription amount successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                      originalCost:
 *                         type: number
 *                         example: 10
 *                      discountAmount:
 *                         type: number
 *                         example: 10
 *                      finalCost:
 *                         type: number
 *                         example: 10
 *                      usedPrevSubscriptionCredit:
 *                         type: number
 *                         example: 10
 *                      usedUserCredit:
 *                         type: number
 *                         example: 10
 *                      remainingPayableAmount:
 *                         type: number
 *                         example: 10
 *                      remainingUserCredit:
 *                         type: number
 *                         example: 10
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
  "/calculate-subscription-amount",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(SubscriptionValidation.calculateSubscriptionAmount),
  SubscriptionController.calculateSubscriptionAmount
);

/**
 * @swagger
 * /api/v1/subscription/create-subscription-request:
 *   post:
 *     summary: Create subscription request
 *     description: Create subscription request and return request id!
 *     tags:
 *       - Subscription
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
 *               planId:
 *                 type: string
 *                 example: 588bfc26-8d1e-4bb8-9ad8-d35881744dbb
 *               billingPeriodId:
 *                 type: string
 *                 example: 4280a172-aa88-4c35-9972-1440f7d90dae
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
 *                   example: Subscription request created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                      requestId:
 *                         type: string
 *                         example: 03a9389f-e04e-49f6-979c-599631f1f0e9
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
  "/create-subscription-request",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(SubscriptionValidation.calculateSubscriptionAmount),
  SubscriptionController.createSubscriptionRequest
);

/**
 * @swagger
 * /api/v1/subscription/stripe-payment-intent:
 *   post:
 *     summary: Crate stripe payment intent
 *     description: Create stripe payment intent and return client_secret
 *     tags:
 *       - Subscription
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
 *               requestId:
 *                 type: string
 *                 example: 588bfc26-8d1e-4bb8-9ad8-d35881744dbb
 *                 description: The request id from subscription request.
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
 *                   example: Subscription request created successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                      client_secret:
 *                         type: string
 *                         example: pi_3RFYBaEmqGd1ENZw0v7JtRKc_secret_GyrMlsE35VbMm4WBdhGR6QygE
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
  "/stripe-payment-intent",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(SubscriptionValidation.createStripePaymentIntent),
  SubscriptionController.createStripeIntent
);

export const SubscriptionRoutes = route;
