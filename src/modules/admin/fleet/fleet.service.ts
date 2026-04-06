import { FleetRepo } from './fleet.repo.js';

export class FleetService {
  static async getAll() {
    return await FleetRepo.findAll();
  }

  static async getById(id: string) {
    const bus = await FleetRepo.findById(id);
    if (!bus) throw new Error('Vehicle not found');
    return bus;
  }

  static async create(data: any) {
    return await FleetRepo.create(data);
  }

  static async update(id: string, data: any) {
    return await FleetRepo.update(id, data);
  }

  static async delete(id: string) {
    return await FleetRepo.delete(id);
  }
}
