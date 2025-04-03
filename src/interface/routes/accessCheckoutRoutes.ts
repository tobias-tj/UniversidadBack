import { Router, Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { GetStudentByIdCheckout } from '../../usecases/students/GetStudenByIdCheckout';
import { AccessCheckoutController } from '../controllers/accessCheckout.controller';
import { validateAccessCheckoutRequest } from '../../domain/interfaces/middleware/validateAccessCheckout';
import { Login } from '../../usecases/admin_login/login';
import { AdminRepository } from '../../infrastructure/repositories/admin_login/AdminRepository';

const router = Router();

const studentRepository = new StudentRepository();
const adminRepository = new AdminRepository();
const getStudentByIdCheckout = new GetStudentByIdCheckout(studentRepository);
const auth = new Login(adminRepository);

const accessCheckoutController = new AccessCheckoutController(
  getStudentByIdCheckout,
  auth,
);

router.get(
  '/accessCheckout',
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.handleAccessCheckoutProcess(req, res, next),
);

export { router as accessCheckoutRoutes };
