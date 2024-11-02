import { Router, Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { GetStudentByIdCheckout } from '../../usecases/students/GetStudenByIdCheckout';
import { AccessCheckoutController } from '../controllers/accessCheckout.controller';
import { validateAccessCheckoutRequest } from '../../domain/interfaces/middleware/validateAccessCheckout';

const router = Router();

const studentRepository = new StudentRepository();
const getStudentByIdCheckout = new GetStudentByIdCheckout(studentRepository);

const accessCheckoutController = new AccessCheckoutController(
  getStudentByIdCheckout,
);

router.get(
  '/accessCheckout',
  validateAccessCheckoutRequest,
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.handleAccessCheckoutProcess(req, res, next),
);

export { router as accessCheckoutRoutes };
