import { Request, Response } from 'express';
import { RouteService } from './route.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export class RouteController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await RouteService.getAll();
      return successResponse(res, 'Routes fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const result = await RouteService.getById(req.params.id);
      return successResponse(res, 'Route fetched successfully', result);
    } catch (err: any) {
      return errorResponse(res, 404, err.message);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await RouteService.create(req.body);
      return successResponse(res, 'Route created successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const result = await RouteService.update(req.params.id, req.body);
      return successResponse(res, 'Route updated successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await RouteService.delete(req.params.id);
      return successResponse(res, 'Route deleted successfully');
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
