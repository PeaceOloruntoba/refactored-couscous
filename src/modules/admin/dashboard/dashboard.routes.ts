import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authGuard, adminGuard } from '../../../middlewares/auth.js';
import { methodNotAllowed } from '../../../middlewares/methodNotAllowed.js';

const router = Router();

router.use(authGuard, adminGuard);

router.route('/')
  .get(DashboardController.getData)
  .all(methodNotAllowed);

export default router;
