import { Router, Request, Response, NextFunction } from 'express';
import { ExamRepository } from '../../infrastructure/repositories/exam/ExamRepository';
import { ExamDashboardController } from '../controllers/examDashboard.controller';
import {
  validateExamIncidentFilter,
  validateExamIncidentByUserID,
  validateExamIncident,
} from '../../domain/interfaces/middleware/examDashboardValidation';

const router = Router();

// Instanciar repositorio y controlador
const examRepository = new ExamRepository();
const examDashboardController = new ExamDashboardController();

// Definir rutas con validaciones y controladores
router.get('/getAllExams', (req: Request, res: Response, next: NextFunction) =>
  examDashboardController.getAllExams(req, res, next),
);

router.get(
  '/getExamIncidentFilter',
  validateExamIncidentFilter,
  (req: Request, res: Response, next: NextFunction) =>
    examDashboardController.getExamIncidentFilter(req, res, next),
);

router.get('/getExamClean', (req: Request, res: Response, next: NextFunction) =>
  examDashboardController.getExamClean(req, res, next),
);

router.get(
  '/getExamIncident',
  validateExamIncident,
  (req: Request, res: Response, next: NextFunction) =>
    examDashboardController.getExamIncident(req, res, next),
);

router.get(
  '/getAllTotalExamCount',
  (req: Request, res: Response, next: NextFunction) =>
    examDashboardController.getAllTotalExamCount(req, res, next),
);

router.get(
  '/getExamIncidentByUserId/:examId',
  validateExamIncidentByUserID,
  (req: Request, res: Response, next: NextFunction) =>
    examDashboardController.getListStudentIncidentByExamId(req, res, next),
);

router.get(
  '/getAllListExamInfo',
  (req: Request, res: Response, next: NextFunction) =>
    examDashboardController.getAllListExamInfo(req, res, next),
);

// Exportar con alias
export { router as examDashboardRoutes };
