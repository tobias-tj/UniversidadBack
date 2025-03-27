import { Router, Request, Response, NextFunction } from 'express';
import { AdminRepository } from '../../infrastructure/repositories/admin_login/AdminRepository';
import { AdminController } from '../controllers/admin.controller';
import { Login } from '../../usecases/admin_login/login';
import { adminLoginValidation } from '../../domain/interfaces/middleware/adminLoginValidation';

const router = Router();

const adminRepository = new AdminRepository();
const auth = new Login(adminRepository);

const adminController = new AdminController(auth);

router.post(
  '/admin/login',
  [...adminLoginValidation],
  (req: Request, res: Response, next: NextFunction) =>
    adminController.login(req, res, next),
);

export { router as adminLoginRoutes };
