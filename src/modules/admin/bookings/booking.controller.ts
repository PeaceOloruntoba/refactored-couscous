import { Request, Response } from 'express';
import { BookingService } from './booking.service.js';
import { successResponse, errorResponse } from '../../../utils/response.js';

export class BookingController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await BookingService.getAll();
      return successResponse(res, 'Bookings fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const result = await BookingService.updateStatus(req.params.id, status);
      return successResponse(res, `Booking status updated to ${status}`, result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await BookingService.delete(req.params.id);
      return successResponse(res, 'Booking soft-deleted successfully');
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
