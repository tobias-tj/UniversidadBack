import { StudentController } from '../controllers/student.controller';
import { StudentRepository } from '../../infrastructure/repositories/student/StudentRepository';
import { CreateStudent } from '../../usecases/students/CreateStudent';
import { ExamRepository } from '../../infrastructure/repositories/exam/ExamRepository';
import { CreateExam } from '../../usecases/exam/CreateExam';
import {
  createExamValidation,
  createStudentValidation,
} from '../../domain/interfaces/middleware/studentValidation';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

const studentRepository = new StudentRepository();
const examRepository = new ExamRepository();
const createStudent = new CreateStudent(studentRepository);
const createExam = new CreateExam(examRepository);

const studentController = new StudentController(createStudent, createExam);

router.post(
  '/createStudentAndExam',
  [...createStudentValidation, ...createExamValidation],
  (req: Request, res: Response, next: NextFunction) =>
    studentController.createExam(req, res, next),
);

export { router as studentRoutes };
