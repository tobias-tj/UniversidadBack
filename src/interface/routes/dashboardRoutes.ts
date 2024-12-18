import { Router, Request, Response, NextFunction } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { GetStudentIncident } from '../../usecases/dashboard/getStudentIncident';
import { GetIncidentsByStudentId } from '../../usecases/dashboard/GetIncidentsByStudentId';
import { DashboardRepository } from '../../infrastructure/repositories/dashboard/dashboardRepository';
import { GetAllStudentsIncidentCount } from '../../usecases/dashboard/GetAllStudentsIncidentCount';

const router = Router();

const dashboardRepository = new DashboardRepository();
const getStudentIncident = new GetStudentIncident(dashboardRepository);
const getIncidentsByExamId = new GetIncidentsByStudentId(dashboardRepository);
const getAllStudentsCount = new GetAllStudentsIncidentCount(
  dashboardRepository,
);
const DashboardController = new dashboardController(
  getStudentIncident,
  getIncidentsByExamId,
  getAllStudentsCount,
);

router.get(
  '/getStudentIncident',
  (req: Request, res: Response, next: NextFunction) =>
    DashboardController.getStudentIncident(req, res, next),
);

router.get(
  '/getIncidentsByStudentId',
  (req: Request, res: Response, next: NextFunction) =>
    DashboardController.getStudentsIncidentByStudentId(req, res, next),
);

router.get(
  '/getAllStudentsCount',
  (req: Request, res: Response, next: NextFunction) =>
    DashboardController.getAllStudentsCount(req, res, next),
);

export { router as dashboardRoutes };
