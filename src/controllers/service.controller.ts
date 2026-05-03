import { Request, Response } from "express";
import { ServiceService } from "../services/service.service";

interface IdParam {
  id: string;
}

export const ServiceController = {
  async getAll(req: Request, res: Response) {
    try {
      const services = await ServiceService.getAll();
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengambil data layanan", error });
    }
  },

  async getById(req: Request<IdParam>, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const service = await ServiceService.getById(id);

      if (!service) {
        return res.status(404).json({ success: false, message: "Layanan tidak ditemukan" });
      }

      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengambil layanan", error });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, code, type } = req.body;

      if (!name || !code || !type) {
        return res.status(400).json({ success: false, message: "name, code, dan type wajib diisi" });
      }

      const service = await ServiceService.create({ name, code, type });
      res.status(201).json({ success: true, data: service, message: "Layanan berhasil dibuat" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal membuat layanan", error });
    }
  },

  async update(req: Request<IdParam>, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const service = await ServiceService.update(id, req.body);
      res.json({ success: true, data: service, message: "Layanan berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengupdate layanan", error });
    }
  },

  async deactivate(req: Request<IdParam>, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await ServiceService.deactivate(id);
      res.json({ success: true, message: "Layanan berhasil dinonaktifkan" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal menonaktifkan layanan", error });
    }
  },
};