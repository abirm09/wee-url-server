import { Router } from "express";
import authGuard from "../../../middlewares/authGuard";
import validateRequest from "../../../middlewares/validateRequest";
import { URLController } from "./url.controller";
import { URLValidation } from "./url.validations";

const router = Router();

router.post(
  "/",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(URLValidation.create),
  URLController.create
);

router.get(
  "/customer",
  authGuard({ requiredRoles: ["customer"] }),
  validateRequest(URLValidation.getAllForCustomers),
  URLController.getAllUser
);

router.get(
  "/tags/customer",
  authGuard({ requiredRoles: ["customer"] }),
  URLController.getUniqueTagsCustomer
);

router.get(
  "/customer/:id",
  authGuard({ requiredRoles: ["customer"] }),
  URLController.getSingleUrlCustomer
);

export const URLRoutes = router;
