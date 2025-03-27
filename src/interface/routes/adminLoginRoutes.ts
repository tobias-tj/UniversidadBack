import { Router, Request, Response, NextFunction } from 'express';
import { AdminRepository } from '../../infrastructure/repositories/admin_login/AdminRepository';
import { AdminController } from '../controllers/admin.controller';
import { Login } from '../../usecases/admin_login/login';
import { adminLoginValidation } from '../../domain/interfaces/middleware/adminLoginValidation';
import { UpdatePassword } from '../../usecases/admin_login/updatePassword';
import { GetUniversity } from '../../usecases/admin_login/getUniversity';

const router = Router();

const adminRepository = new AdminRepository();
const auth = new Login(adminRepository);
const updatePass = new UpdatePassword(adminRepository);
const universidadList = new GetUniversity(adminRepository);

const adminController = new AdminController(auth, updatePass, universidadList);

router.post(
  '/admin/login',
  [...adminLoginValidation],
  (req: Request, res: Response, next: NextFunction) =>
    adminController.login(req, res, next),
);

router.put(
  '/admin/updatePass',
  (req: Request, res: Response, next: NextFunction) =>
    adminController.updatePassword(req, res, next),
);

router.get(
  '/admin/getUniversity',
  (req: Request, res: Response, next: NextFunction) =>
    adminController.getUniversity(req, res, next),
);

export { router as adminLoginRoutes };
