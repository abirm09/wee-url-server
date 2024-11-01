import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SubscriptionPlanRoutes } from "../modules/subscriptionPlan/subscriptionPlan.routes";
import { UserRoutes } from "../modules/user_management/user/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/subscription-plan",
    route: SubscriptionPlanRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
