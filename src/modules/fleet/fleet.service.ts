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
}
