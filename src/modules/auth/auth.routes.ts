import { Router } from 'express';
import { authLimiter, otpLimiter, dbRateLimit } from '../../middlewares/rateLimit.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';

const router = Router();

const dbAuthLimiter = dbRateLimit({ keyPrefix: 'auth', windowMs: 60 * 1000, limit: 10 });
const dbOtpLimiter = dbRateLimit({ keyPrefix: 'otp', windowMs: 10 * 60 * 1000, limit: 20 });

router.route('/login').post(dbAuthLimiter, authLimiter).all(methodNotAllowed);
