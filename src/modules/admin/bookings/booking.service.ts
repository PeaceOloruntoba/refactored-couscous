import { BookingRepo } from './booking.repo.js';

export class BookingService {
  static async getAll() {
    return await BookingRepo.findAll();
  }

  static async updateStatus(id: string, status: string) {
    const booking = await BookingRepo.updateStatus(id, status);
    if (!booking) throw new Error('Booking not found or already deleted');
    return booking;
  }

  static async delete(id: string) {
    return await BookingRepo.softDelete(id);
  }
}
