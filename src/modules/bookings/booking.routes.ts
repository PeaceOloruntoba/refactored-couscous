import { Router } from 'express';
import { BookingController } from './booking.controller.js';
import { authGuard } from '../../middlewares/auth.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';

const router = Router();

router.use(authGuard);

router.route('/')
  .post(BookingController.create)
  .get(BookingController.myBookings)
  .all(methodNotAllowed);

router.route('/verify/:reference')
  .get(BookingController.verifyPayment)
  .all(methodNotAllowed);

export default router;
