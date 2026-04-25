import { Router } from 'express';
import { BookingController } from './booking.controller.js';
import { authGuard } from '../../middlewares/auth.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';

const router = Router();

router.route('/')
  .post(authGuard, BookingController.create)
  .get(authGuard, BookingController.myBookings)
  .all(methodNotAllowed);

router.route('/seats')
  .get(authGuard, BookingController.getBookedSeats)
  .all(methodNotAllowed);

router.route('/verify/:reference')
  .get(BookingController.verifyPayment)
  .all(methodNotAllowed);

export default router;
