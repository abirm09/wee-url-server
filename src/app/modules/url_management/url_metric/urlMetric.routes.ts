import { Router } from "express";
import authGuard from "../../../middlewares/authGuard";
import { UrlMetricController } from "./urlMetric.controller";

const router = Router();

router.get(
  "/:id",
  authGuard({ requiredRoles: ["customer"] }),
  UrlMetricController.get
);

export const UrlMetricRoutes = router;
