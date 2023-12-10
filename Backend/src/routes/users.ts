import express from "express";
import * as userController from "../controllers/users";
import { requireAuth } from "../middleware/Auth";

const router = express.Router();
router.get("/", userController.getAuthenticatedUser);
router.post("/Signup", userController.SignUp);
router.post("/Login", userController.Login);

router.post("/Logout", userController.Logout);

export default router;
