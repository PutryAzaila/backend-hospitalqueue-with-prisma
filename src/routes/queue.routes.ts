import { Router } from "express";
import { QueueController } from "../controllers/queue.controller";

const router = Router();

router.get("/display", QueueController.getDisplay);
router.get("/display/:serviceId", QueueController.getDisplayByService);
router.post("/call-next", QueueController.callNext);

router.get("/", QueueController.getAll);
router.post("/", QueueController.create);
router.get("/:id", QueueController.getById);
router.patch("/:id/status", QueueController.updateStatus);

export default router;