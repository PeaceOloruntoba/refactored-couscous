import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      return successResponse(res, 'Signup successful. Please verify your email with the OTP sent.', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      if (!result.verified) {
        return successResponse(res, 'Please verify your account', result);
      }
      return successResponse(res, 'Login successful', result);
    } catch (err: any) {
      return errorResponse(res, 401, err.message);
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const result = await AuthService.verifyOTP(req.body);
      return successResponse(res, 'Account verified successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      return successResponse(res, 'If an account exists, an OTP has been sent', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      await AuthService.resetPassword(req.body);
      return successResponse(res, 'Password reset successful');
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await AuthService.updateProfile(userId, req.body);
      return successResponse(res, 'Profile updated successfully', result);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const user = await AuthService.updateProfile(userId, {}); // Just fetch
      return successResponse(res, 'User profile fetched', user);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
