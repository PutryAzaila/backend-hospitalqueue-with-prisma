import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Semua user yang login bisa lihat layanan
router.get("/", authenticate, ServiceController.getAll);
router.get("/:id", authenticate, ServiceController.getById);

// Hanya SUPER_ADMIN yang bisa kelola layanan
router.post("/", authenticate, authorize("SUPER_ADMIN"), ServiceController.create);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN"), ServiceController.update);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), ServiceController.deactivate);

export default router;