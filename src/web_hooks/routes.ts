import { Router } from "express";
import { StripeWebHook } from "./stripe/stripe.hook";

const router = Router();

router.post("/stripe", StripeWebHook);

export const WebhookRoutes = router;
