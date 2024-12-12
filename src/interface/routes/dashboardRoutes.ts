import { Router, Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { GetStudentByIdCheckout } from '../../usecases/students/GetStudenByIdCheckout';
import { AccessCheckoutController } from '../controllers/accessCheckout.controller';
import { validateAccessCheckoutRequest } from '../../domain/interfaces/middleware/validateAccessCheckout';
import { dashboardController } from '../controllers/dashboard.controller';
import { StudentFindAll } from '../../usecases/students/StudentFindAll';
import { GetStudentIncident } from '../../usecases/students/getStudentIncident';

const router = Router();

const studentRepository = new StudentRepository();
const studentFindAll = new StudentFindAll(studentRepository);
const getStudentIncident = new GetStudentIncident(studentRepository);
const DashboardController = new dashboardController(studentFindAll, getStudentIncident);

router.get(
  '/getAllStudents',
  (req: Request, res: Response, next: NextFunction) =>
    DashboardController.getAllStudents(req, res, next),
);

router.get(
    '/getStudentIncident',
    (req: Request, res: Response, next: NextFunction) =>
      DashboardController.getStudentIncident(req, res, next),
  );

export { router as dashboardRoutes };
