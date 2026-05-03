import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN", "SUSTER", "DOKTER"), PatientController.getAll);
router.get("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN", "SUSTER", "DOKTER"), PatientController.getById);
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN"), PatientController.create);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN_PENDAFTARAN"), PatientController.update);

export default router;