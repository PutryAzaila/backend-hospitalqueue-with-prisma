import { Router } from "express";
import { PatientController } from "../controllers/patient.controller";

const router = Router();

router.get("/", PatientController.getAll);       // Bisa ditambah ?search=nama
router.get("/:id", PatientController.getById);
router.post("/", PatientController.create);
router.patch("/:id", PatientController.update);

export default router;