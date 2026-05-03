import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";

const router = Router();

router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getById);
router.post("/", ServiceController.create);
router.patch("/:id", ServiceController.update);
router.delete("/:id", ServiceController.deactivate); // Soft delete

export default router;