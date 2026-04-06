import { Router } from 'express';
import { BookingController } from './booking.controller.js';
import { authGuard, adminGuard } from '../../../middlewares/auth.js';
import { methodNotAllowed } from '../../../middlewares/methodNotAllowed.js';

const router = Router();

router.use(authGuard, adminGuard);

router.route('/')
  .get(BookingController.getAll)
  .all(methodNotAllowed);

router.route('/:id')
  .patch(BookingController.updateStatus)
  .delete(BookingController.delete)
  .all(methodNotAllowed);

export default router;
