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
import { CreateExamUser } from '../../usecases/manage_exam_user/CreateExamUser';
import { ManageExamUserRepository } from '../../infrastructure/repositories/manage_exam_user/ManageExamUserRepository';
import { FindMatchStudentExam } from '../../usecases/manage_exam_user/FindMatchStudentExam';

const router = Router();

const studentRepository = new StudentRepository();
const examRepository = new ExamRepository();
const manageExamUserRepository = new ManageExamUserRepository();
const createStudent = new CreateStudent(studentRepository);
const getStudentById = new GetStudentById(studentRepository);
const createExam = new CreateExam(examRepository);
const getExamById = new GetExamById(examRepository);
const createExamUser = new CreateExamUser(manageExamUserRepository);
const findMatchStudentExam = new FindMatchStudentExam(manageExamUserRepository);

const firstProcessController = new FirstProcessController(
  createStudent,
  getStudentById,
  createExam,
  getExamById,
  findMatchStudentExam,
  createExamUser,
);

router.post(
  '/firstProcess',
  [...createStudentValidation, ...createExamValidation],
  (req: Request, res: Response, next: NextFunction) =>
    firstProcessController.handleExamProcess(req, res, next),
);

export { router as firstProcessRoutes };
