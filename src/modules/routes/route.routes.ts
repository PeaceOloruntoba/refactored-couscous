import { Router } from 'express';
import { RouteController } from './route.controller.js';
import { authGuard, adminGuard } from '../../middlewares/auth.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';

const router = Router();

// Public routes for users to browse
router.route('/')
  .get(RouteController.getAll)
  .post(authGuard, adminGuard, RouteController.create)
  .all(methodNotAllowed);

router.route('/:id')
  .get(RouteController.getById)
  .put(authGuard, adminGuard, RouteController.update)
  .delete(authGuard, adminGuard, RouteController.delete)
  .all(methodNotAllowed);

export default router;
