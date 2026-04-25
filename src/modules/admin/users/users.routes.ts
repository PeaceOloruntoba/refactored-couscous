import { Router } from "express";
import { AdminUserController } from "./users.controller.js";

const router = Router();

router.get("/", AdminUserController.getAllUsers);
router.get("/stats", AdminUserController.getUserStats);
router.get("/:id", AdminUserController.getUserById);
router.patch("/:id", AdminUserController.updateUser);

export default router;
