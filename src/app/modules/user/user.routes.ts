import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { UserValidations } from "./user.validations";

const route = Router();

route.post("/", validateRequest(UserValidations.create), UserController.create);

export const UserRoutes = route;
