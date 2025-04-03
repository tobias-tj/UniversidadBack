import { Router, Request, Response, NextFunction } from 'express';
import { AdminRepository } from '../../infrastructure/repositories/admin_login/AdminRepository';
import { AdminController } from '../controllers/admin.controller';
import { Login } from '../../usecases/admin_login/login';
import { adminLoginValidation } from '../../domain/interfaces/middleware/adminLoginValidation';
import { GetUniversityList } from '../../usecases/admin_login/GetUniversityList';

const router = Router();

const adminRepository = new AdminRepository();
const auth = new Login(adminRepository);
const universidadList = new GetUniversityList(adminRepository);

const adminController = new AdminController(auth, universidadList);

router.post(
  '/admin/login',
  [...adminLoginValidation],
  (req: Request, res: Response, next: NextFunction) =>
    adminController.login(req, res, next),
);

router.get(
  '/getUniversity',
  (req: Request, res: Response, next: NextFunction) =>
    adminController.getUniversity(req, res, next),
);

export { router as adminLoginRoutes };
