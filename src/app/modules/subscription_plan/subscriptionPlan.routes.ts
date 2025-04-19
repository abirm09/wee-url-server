import { Router } from "express";
import authGuard from "../../middlewares/authGuard";
import validateRequest from "../../middlewares/validateRequest";
import { SubscriptionPlanController } from "./subscriptionPlan.controller";
import { SubscriptionPlanValidation } from "./subscriptionPlan.validations";

const router = Router();

/**
 * @swagger
 * /api/v1/subscription-plan:
 *   post:
 *     summary: Create subscription plan
 *     description: Create subreption plan and return the data.
 *     tags:
 *       - Subscription plan
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
 *               subscriptionData:
 *                 type: object
 *                 properties:
 *                    name:
 *                      type: string
 *                      example: Free
 *                    type:
 *                      type: string
 *                      example: free
 *                    description:
 *                      type: string
 *                      example: This is example description
 *                    maxURLsAllowed:
 *                      type: number
 *                      example: 10
 *                    customURLSlug:
 *                      type: string
 *                      example: dev_prof
 *                    APIAccess:
 *                      type: boolean
 *                      example: true
 *                    bulkURLShortening:
 *                      type: boolean
 *                      example: true
 *                    customURLRedirectRules:
 *                      type: boolean
 *                      example: true
 *                    canSetExpiration:
 *                      type: boolean
 *                      example: true
 *                    allowURLEditing:
 *                      type: boolean
 *                      example: true
 *                    showAds:
 *                      type: boolean
 *                      example: true
 *                    QRCode:
 *                      type: boolean
 *                      example: true
 *                    customDomainAllowed:
 *                      type: boolean
 *                      example: true
 *                    analyticsAccess:
 *                      type: boolean
 *                      example: true
 *                    prioritySupport:
 *                      type: boolean
 *                      example: true
 *                    brandingCustomization:
 *                      type: boolean
 *                      example: true
 *                    geoTargetingEnabled:
 *                      type: boolean
 *                      example: true
 *                    linkRotation:
 *                      type: boolean
 *                      example: true
 *                    canSetPassword:
 *                      type: boolean
 *                      example: true
 *                    isPublic:
 *                      type: boolean
 *                      example: true
 *                    isActive:
 *                      type: boolean
 *                      example: true
 *               billingData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     periodType:
 *                       type: string
 *                       example: monthly | sixMonth | yearly
 *                     price:
 *                       type: string
 *                       example: 9.99
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
 *                   example: Subscription plan created successfully.
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
  authGuard({ requiredRoles: ["superAdmin"] }),
  validateRequest(SubscriptionPlanValidation.create),
  SubscriptionPlanController.create
);

/**
 * @swagger
 * /api/v1/subscription-pan:
 *   get:
 *     summary: Retrieve all subscription
 *     description: Get all subscriptions
 *     tags:
 *       - Subscription plan
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
 *                   example: All subscription plan retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                    name:
 *                      type: string
 *                      example: Free
 *                    type:
 *                      type: string
 *                      example: free
 *                    description:
 *                      type: string
 *                      example: This is example description
 *                    maxURLsAllowed:
 *                      type: number
 *                      example: 10
 *                    customURLSlug:
 *                      type: string
 *                      example: dev_prof
 *                    APIAccess:
 *                      type: boolean
 *                      example: true
 *                    bulkURLShortening:
 *                      type: boolean
 *                      example: true
 *                    customURLRedirectRules:
 *                      type: boolean
 *                      example: true
 *                    canSetExpiration:
 *                      type: boolean
 *                      example: true
 *                    allowURLEditing:
 *                      type: boolean
 *                      example: true
 *                    showAds:
 *                      type: boolean
 *                      example: true
 *                    QRCode:
 *                      type: boolean
 *                      example: true
 *                    customDomainAllowed:
 *                      type: boolean
 *                      example: true
 *                    analyticsAccess:
 *                      type: boolean
 *                      example: true
 *                    prioritySupport:
 *                      type: boolean
 *                      example: true
 *                    brandingCustomization:
 *                      type: boolean
 *                      example: true
 *                    geoTargetingEnabled:
 *                      type: boolean
 *                      example: true
 *                    linkRotation:
 *                      type: boolean
 *                      example: true
 *                    canSetPassword:
 *                      type: boolean
 *                      example: true
 *                    isPublic:
 *                      type: boolean
 *                      example: true
 *                    isActive:
 *                      type: boolean
 *                      example: true
 *                    billingData:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          periodType:
 *                            type: string
 *                            example: monthly | sixMonth | yearly
 *                          price:
 *                            type: string
 *                            example: 9.99
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
  "/",
  // authGuard({ requiredRoles: ["admin"] }),
  SubscriptionPlanController.getAllPlans
);

/**
 * @swagger
 * /api/v1/:id:
 *   patch:
 *     summary: Update subscription plan
 *     description: Update subreption plan and return the data.
 *     tags:
 *       - Subscription plan
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
 *               subscriptionData:
 *                 type: object
 *                 properties:
 *                    name:
 *                      type: string
 *                      example: Free
 *                    type:
 *                      type: string
 *                      example: free
 *                    description:
 *                      type: string
 *                      example: This is example description
 *                    maxURLsAllowed:
 *                      type: number
 *                      example: 10
 *                    customURLSlug:
 *                      type: string
 *                      example: dev_prof
 *                    APIAccess:
 *                      type: boolean
 *                      example: true
 *                    bulkURLShortening:
 *                      type: boolean
 *                      example: true
 *                    customURLRedirectRules:
 *                      type: boolean
 *                      example: true
 *                    canSetExpiration:
 *                      type: boolean
 *                      example: true
 *                    allowURLEditing:
 *                      type: boolean
 *                      example: true
 *                    showAds:
 *                      type: boolean
 *                      example: true
 *                    QRCode:
 *                      type: boolean
 *                      example: true
 *                    customDomainAllowed:
 *                      type: boolean
 *                      example: true
 *                    analyticsAccess:
 *                      type: boolean
 *                      example: true
 *                    prioritySupport:
 *                      type: boolean
 *                      example: true
 *                    brandingCustomization:
 *                      type: boolean
 *                      example: true
 *                    geoTargetingEnabled:
 *                      type: boolean
 *                      example: true
 *                    linkRotation:
 *                      type: boolean
 *                      example: true
 *                    canSetPassword:
 *                      type: boolean
 *                      example: true
 *                    isPublic:
 *                      type: boolean
 *                      example: true
 *                    isActive:
 *                      type: boolean
 *                      example: true
 *               billingData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     periodType:
 *                       type: string
 *                       example: monthly | sixMonth | yearly
 *                     price:
 *                       type: string
 *                       example: 9.99
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
 *                   example: Subscription plan created successfully.
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
router.patch(
  "/:id",
  authGuard({ requiredRoles: ["admin"] }),
  validateRequest(SubscriptionPlanValidation.update),
  SubscriptionPlanController.updatePlan
);

export const SubscriptionPlanRoutes = router;
