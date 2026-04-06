import { BookingRepo, PaymentRepo } from './booking.repo.js';
import { PaystackService } from '../../utils/paystack.js';
import { RouteRepo } from '../routes/route.repo.js';
import { AuthRepo } from '../auth/auth.repo.js';

export class BookingService {
  static async createBooking(userId: string, data: any) {
    const { route_id, departure_time, booking_date, seats } = data;
    const route = await RouteRepo.findById(route_id);
    if (!route) throw new Error('Route not found');

    const user = await AuthRepo.findById(userId);
    if (!user) throw new Error('User not found');

    const totalFare = route.fare * seats.length;
    const reference = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = await BookingRepo.create({
      user_id: userId,
      route_id,
      departure_time,
      booking_date,
      seats,
      total_fare: totalFare,
      reference
    });

    await PaymentRepo.create({
      booking_id: booking.id,
      user_id: userId,
      amount: totalFare,
      reference
    });

    const paymentInit = await PaystackService.initializeTransaction(
      user.email,
      totalFare,
      reference,
      { booking_id: booking.id }
    );

    return { booking, payment: paymentInit };
  }

  static async verifyPayment(reference: string) {
    const data = await PaystackService.verifyTransaction(reference);
    if (data.status === 'success') {
      const booking = await BookingRepo.findByReference(reference);
      if (booking) {
        await BookingRepo.updatePaymentStatus(booking.id, 'paid');
        await PaymentRepo.updateStatus(reference, 'success', data.paid_at, data.channel);
      }
      return { success: true, booking };
    }
    return { success: false, status: data.status };
  }

  static async getUserBookings(userId: string) {
    return await BookingRepo.getUserBookings(userId);
  }
}
