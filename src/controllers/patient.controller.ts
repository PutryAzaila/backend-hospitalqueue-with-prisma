import { Request, Response } from "express";
import { PatientService } from "../services/patient.service";

interface IdParam {
  id: string;
}

export const PatientController = {
  async getAll(req: Request, res: Response) {
    try {
      const search = req.query.search as string | undefined;
      const patients = await PatientService.getAll(search);
      res.json({ success: true, data: patients });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengambil data pasien", error });
    }
  },

  async getById(req: Request<IdParam>, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const patient = await PatientService.getById(id);

      if (!patient) {
        return res.status(404).json({ success: false, message: "Pasien tidak ditemukan" });
      }

      res.json({ success: true, data: patient });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengambil pasien", error });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, nik, birthDate, gender, phone, medicalRecordNumber } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: "Nama pasien wajib diisi" });
      }

      const mrn = medicalRecordNumber ?? await PatientService.generateMedicalRecordNumber();

      const patient = await PatientService.create({
        name,
        medicalRecordNumber: mrn,
        nik,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender,
        phone,
      });

      res.status(201).json({ success: true, data: patient, message: "Pasien berhasil didaftarkan" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mendaftarkan pasien", error });
    }
  },

  async update(req: Request<IdParam>, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const patient = await PatientService.update(id, req.body);
      res.json({ success: true, data: patient, message: "Data pasien berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengupdate pasien", error });
    }
  },
};