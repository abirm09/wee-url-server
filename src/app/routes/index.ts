import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SubscriptionRoutes } from "../modules/subscription/subscription.routes";
import { SubscriptionPlanRoutes } from "../modules/subscription_plan/subscriptionPlan.routes";
import { URLRoutes } from "../modules/url_management/url/url.routes";
import { UrlMetricRoutes } from "../modules/url_management/url_metric/urlMetric.routes";
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
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
  {
    path: "/url",
    route: URLRoutes,
  },
  {
    path: "/url-metric",
    route: UrlMetricRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
