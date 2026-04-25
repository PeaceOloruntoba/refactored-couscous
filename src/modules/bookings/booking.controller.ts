import { Request, Response } from 'express';
import { BookingService } from './booking.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export class BookingController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await BookingService.createBooking(userId, req.body);
      console.log("Result ", result)
      return successResponse(res, 'Booking created successfully', result);
    } catch (err: any) {
      console.log("Error: ", err)
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

  static async getBookedSeats(req: Request, res: Response) {
    try {
      const { route_id, departure_time, booking_date } = req.query;
      if (!route_id || !departure_time || !booking_date) {
        throw new Error('Missing required query parameters');
      }
      const result = await BookingService.getBookedSeats(
        route_id as string, 
        departure_time as string, 
        booking_date as string
      );
      return successResponse(res, 'Booked seats fetched successfully', result);
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
