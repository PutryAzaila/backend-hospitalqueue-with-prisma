import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const UserController = {
  async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengambil data user", error });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params["id"] as string);
      const user = await UserService.getById(id);

      if (!user) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengambil user", error });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "name, email, password, dan role wajib diisi",
        });
      }

      const validRoles = [
        "SUPER_ADMIN",
        "ADMIN_PENDAFTARAN",
        "SUSTER",
        "DOKTER",
        "FARMASI",
        "LAB",
        "DISPLAY_ONLY",
      ];

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Role tidak valid. Pilihan: ${validRoles.join(", ")}`,
        });
      }

      const user = await UserService.create({ name, email, password, role });
      res.status(201).json({
        success: true,
        data: user,
        message: "User berhasil dibuat",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Gagal membuat user",
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params["id"] as string);
      const user = await UserService.update(id, req.body);
      res.json({ success: true, data: user, message: "User berhasil diupdate" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengupdate user", error });
    }
  },

  async toggle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params["id"] as string);
      const user = await UserService.toggle(id);
      res.json({
        success: true,
        data: user,
        message: `User berhasil ${user.isActive ? "diaktifkan" : "dinonaktifkan"}`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal mengubah status user", error });
    }
  },

  async deactivate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params["id"] as string);
      await UserService.deactivate(id);
      res.json({ success: true, message: "User berhasil dinonaktifkan" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Gagal menonaktifkan user", error });
    }
  },
};