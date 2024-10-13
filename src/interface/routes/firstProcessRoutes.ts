import { FirstProcessController } from '../controllers/firstProcess.controller';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { CreateStudent } from '../../usecases/students/CreateStudent';
import { ExamRepository } from '../../infrastructure/repositories/exam/ExamRepository';
import { CreateExam } from '../../usecases/exam/CreateExam';
import { createStudentValidation } from '../../domain/interfaces/middleware/studentValidation';
import { Router, Request, Response, NextFunction } from 'express';
import { createExamValidation } from '../../domain/interfaces/middleware/examValidation';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { GetExamById } from '../../usecases/exam/GetExamById';

const router = Router();

const studentRepository = new StudentRepository();
const examRepository = new ExamRepository();
const createStudent = new CreateStudent(studentRepository);
const getStudentById = new GetStudentById(studentRepository);
const createExam = new CreateExam(examRepository);
const getExamById = new GetExamById(examRepository);

const firstProcessController = new FirstProcessController(
  createStudent,
  getStudentById,
  createExam,
  getExamById,
);

router.post(
  '/firstProcess',
  [...createStudentValidation, ...createExamValidation],
  (req: Request, res: Response, next: NextFunction) =>
    firstProcessController.handleExamProcess(req, res, next),
);

export { router as firstProcessRoutes };
