import { Router } from 'express';
import { FleetController } from './fleet.controller.js';
import { authGuard, adminGuard } from '../../../middlewares/auth.js';
import { methodNotAllowed } from '../../../middlewares/methodNotAllowed.js';

const router = Router();

// Apply guards to all fleet routes
router.use(authGuard, adminGuard);

router.route('/')
  .get(FleetController.getAll)
  .post(FleetController.create)
  .all(methodNotAllowed);

router.route('/:id')
  .get(FleetController.getById)
  .put(FleetController.update)
  .delete(FleetController.delete)
  .all(methodNotAllowed);

export default router;
