import { Request, Response } from 'express';
import { BookingService } from './booking.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export class BookingController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await BookingService.createBooking(userId, req.body);
      return successResponse(res, 'Booking created successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async verifyPayment(req: Request, res: Response) {
    try {
      const { reference } = req.params;
      const result = await BookingService.verifyPayment(reference);
      return successResponse(res, 'Payment verification status', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async myBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await BookingService.getUserBookings(userId);
      return successResponse(res, 'My bookings fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
