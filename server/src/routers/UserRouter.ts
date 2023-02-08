import { Router } from "express";
import userController from "../controller/user-controller";
/**
 *      Handle '/user' route
 */

const UserRouter = Router();

UserRouter.post("/sign-up", userController.registrate);

export default UserRouter;
