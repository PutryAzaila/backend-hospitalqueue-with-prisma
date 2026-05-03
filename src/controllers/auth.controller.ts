import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email dan password wajib diisi",
        });
      }

      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login gagal",
      });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const user = await AuthService.getMe(req.user!.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data user",
      });
    }
  },

  async logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: "Logout berhasil. Hapus token di sisi client.",
    });
  },
};