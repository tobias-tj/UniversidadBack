
import { Router, Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { GetStudentResumeReport } from '../../usecases/students/GetStudentResumeReport';
import { ResumeReportController } from '../controllers/resumeReport.Controller';

const studentRepository = new StudentRepository();
const getStudentResumeReport = new GetStudentResumeReport(studentRepository);
const resumeReportController = new ResumeReportController(getStudentResumeReport);
const router = Router();
router.get(
    '/GetStudentReport',
    (req: Request, res: Response, next: NextFunction) =>
      resumeReportController.getStudentIncident(req, res, next),
  );

  
export { router as reportRoutes };