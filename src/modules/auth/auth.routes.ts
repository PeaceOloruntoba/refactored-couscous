import { Router } from 'express';
import { authLimiter, otpLimiter, dbRateLimit } from '../../middlewares/rateLimit.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';
import { AuthController } from './auth.controller.js';
import { authGuard } from '../../middlewares/auth.js';

const router = Router();

const dbAuthLimiter = dbRateLimit({ keyPrefix: 'auth', windowMs: 60 * 1000, limit: 10 });
const dbOtpLimiter = dbRateLimit({ keyPrefix: 'otp', windowMs: 10 * 60 * 1000, limit: 20 });

router.route('/signup').post(dbAuthLimiter, AuthController.signup).all(methodNotAllowed);
router.route('/login').post(dbAuthLimiter, authLimiter, AuthController.login).all(methodNotAllowed);
router.route('/verify-otp').post(dbOtpLimiter, otpLimiter, AuthController.verifyOTP).all(methodNotAllowed);
router.route('/forgot-password').post(dbOtpLimiter, AuthController.forgotPassword).all(methodNotAllowed);
router.route('/reset-password').post(dbOtpLimiter, AuthController.resetPassword).all(methodNotAllowed);

router.route('/profile').get(authGuard, AuthController.me).put(authGuard, AuthController.updateProfile).all(methodNotAllowed);

export default router;
