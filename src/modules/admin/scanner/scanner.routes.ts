import { Router } from 'express';
import { ScannerController } from './scanner.controller.js';
import { authGuard, adminGuard } from '../../../middlewares/auth.js';
import { methodNotAllowed } from '../../../middlewares/methodNotAllowed.js';

const router = Router();

router.use(authGuard, adminGuard);

router.route('/verify/:ticketId')
  .get(ScannerController.verify)
  .all(methodNotAllowed);

router.route('/validate/:ticketId')
  .post(ScannerController.validate)
  .all(methodNotAllowed);

export default router;
