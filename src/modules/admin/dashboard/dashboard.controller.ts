import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service.js';
import { successResponse, errorResponse } from '../../../utils/response.js';

export class DashboardController {
  static async getData(req: Request, res: Response) {
    try {
      const result = await DashboardService.getDashboardData();
      return successResponse(res, 'Dashboard data fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
