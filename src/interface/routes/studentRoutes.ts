import { Router } from 'express';
import { GetAllEstudiantes } from '../../usecases/students/GetAllEstudiantes';
import { StudentController } from '../controllers/student.controller';
import { StudentRepository } from '../../infrastructure/repositories/StudentRepository';
import { CreateStudent } from '../../usecases/students/CreateStudent';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { UpdateStudent } from '../../usecases/students/UpdateStudent';

const router = Router();

const studentRepository = new StudentRepository();
const getAllStudents = new GetAllEstudiantes(studentRepository);
const createStudent = new CreateStudent(studentRepository);
const getStudentById = new GetStudentById(studentRepository);
const updateStudent = new UpdateStudent(studentRepository);

const studentController = new StudentController(
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
);

router.get('/getAllStudents', (req, res, next) =>
  studentController.getAll(req, res, next),
);

router.get('/getStudentById/:id', (req, res, next) =>
  studentController.getStudentById(req, res, next),
);

router.post('/createStudent', (req, res, next) =>
  studentController.createStudent(req, res, next),
);

router.patch('/updateStudentById', (req, res, next) =>
  studentController.updateStudent(req, res, next),
);

export { router as studentRoutes };
