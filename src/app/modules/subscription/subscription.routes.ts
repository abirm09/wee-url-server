import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";

const route = Router();

route.post("/", SubscriptionController.createSubscription);

export const SubscriptionRoutes = route;
