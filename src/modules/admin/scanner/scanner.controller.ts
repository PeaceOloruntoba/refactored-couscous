import { Request, Response } from 'express';
import { ScannerService } from './scanner.service.js';
import { successResponse, errorResponse } from '../../../utils/response.js';

export class ScannerController {
  static async verify(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const result = await ScannerService.verifyTicket(ticketId);
      return successResponse(res, 'Ticket verified', result);
    } catch (err: any) {
      return errorResponse(res, 404, err.message);
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const result = await ScannerService.validateTicket(ticketId);
      return successResponse(res, 'Ticket validated successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
