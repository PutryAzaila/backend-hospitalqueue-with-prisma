import { Router } from "express";
import { QueueController } from "../controllers/queue.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/display", QueueController.getDisplay);
router.get("/display/:serviceId", QueueController.getDisplayByService);

router.get("/", authenticate, QueueController.getAll);
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN"), QueueController.create);
router.get("/:id", authenticate, QueueController.getById);

router.post(
  "/call-next",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN", "SUSTER", "DOKTER", "FARMASI", "LAB"),
  QueueController.callNext
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN", "SUSTER", "DOKTER", "FARMASI", "LAB"),
  QueueController.updateStatus
);

export default router;