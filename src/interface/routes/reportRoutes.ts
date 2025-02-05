import { Router, Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { GetStudentResumeReport } from '../../usecases/students/GetStudentResumeReport';
import { GetAllReportByIdRelation } from '../../usecases/report/GetAllReportByIdRelation';
import { ResumeReportController } from '../controllers/resumeReport.Controller';
import { ReportRepository } from '../../infrastructure/repositories/report/ReportRepository';
import { GetReportCount } from '../../usecases/report/getReportCount';

const studentRepository = new StudentRepository();
const reportsRepository = new ReportRepository();
const getStudentResumeReport = new GetStudentResumeReport(studentRepository);
const getReportCount = new GetReportCount(reportsRepository);
const getAllReportByIdRelation = new GetAllReportByIdRelation(
  reportsRepository
);
const resumeReportController = new ResumeReportController(
  getStudentResumeReport,
  getAllReportByIdRelation,
  getReportCount
);
const router = Router();
router.get(
  '/GetStudentReport',
  (req: Request, res: Response, next: NextFunction) =>
    resumeReportController.getStudentIncident(req, res, next),
);

router.get(
  '/GetReportCounts',
  (req: Request, res: Response, next: NextFunction) =>
    resumeReportController.getReportCounts(req, res, next),
);

router.get(
  '/generateReportByIdRelation',
  (req: Request, res: Response, next: NextFunction) =>
    resumeReportController.generateReportByIdRelation(req, res, next),
);

export { router as reportRoutes };
