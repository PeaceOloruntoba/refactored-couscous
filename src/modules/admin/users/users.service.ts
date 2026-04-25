import { AdminUserRepo } from "./users.repo.js";

export class AdminUserService {
  static async getAllUsers() {
    return await AdminUserRepo.findAll();
  }

  static async getUserById(id: string) {
    return await AdminUserRepo.findById(id);
  }

  static async updateUser(id: string, data: any) {
    return await AdminUserRepo.update(id, data);
  }

  static async getUserStats() {
    return await AdminUserRepo.getUserStats();
  }
}
