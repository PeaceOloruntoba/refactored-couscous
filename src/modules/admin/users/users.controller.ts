import { Request, Response } from "express";
import { AdminUserService } from "./users.service.js";

export class AdminUserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await AdminUserService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await AdminUserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const user = await AdminUserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUserStats(req: Request, res: Response) {
    try {
      const stats = await AdminUserService.getUserStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
