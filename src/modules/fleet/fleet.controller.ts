import { Request, Response } from 'express';
import { FleetService } from './fleet.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export class FleetController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await FleetService.getAll();
      return successResponse(res, 'Fleet fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const result = await FleetService.getById(req.params.id);
      return successResponse(res, 'Vehicle fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 404, err.message);
    }
  }

}
