import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, authorize("SUPER_ADMIN"), UserController.getAll);
router.get("/:id", authenticate, authorize("SUPER_ADMIN"), UserController.getById);
router.post("/", authenticate, authorize("SUPER_ADMIN"), UserController.create);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN"), UserController.update);
router.patch("/:id/toggle", authenticate, authorize("SUPER_ADMIN"), UserController.toggle);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), UserController.deactivate);

export default router;