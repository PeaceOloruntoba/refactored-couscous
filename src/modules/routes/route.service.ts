import { RouteRepo } from './route.repo.js';

export class RouteService {
  static async getAll() {
    return await RouteRepo.findAll();
  }

  static async getById(id: string) {
    const route = await RouteRepo.findById(id);
    if (!route) throw new Error('Route not found');
    return route;
  }

  static async create(data: any) {
    return await RouteRepo.create(data);
  }

  static async update(id: string, data: any) {
    return await RouteRepo.update(id, data);
  }

  static async delete(id: string) {
    return await RouteRepo.delete(id);
  }
}
