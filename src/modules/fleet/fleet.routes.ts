import { Router } from 'express';
import { FleetController } from './fleet.controller.js';
import { authGuard } from '../../middlewares/auth.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';

const router = Router();

// Apply guards to all fleet routes
router.use(authGuard);

router.route('/')
  .get(FleetController.getAll)
  .all(methodNotAllowed);

router.route('/:id')
  .get(FleetController.getById)
  .all(methodNotAllowed);

export default router;
