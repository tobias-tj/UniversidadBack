import { Router } from 'express';
import { GetAllEstudiantes } from '../../usecases/students/GetAllEstudiantes';
import { StudentController } from '../controllers/student.controller';
import { StudentRepository } from '../../infrastructure/repositories/StudentRepository';

const router = Router();

const studentRepository = new StudentRepository();
const getAllStudents = new GetAllEstudiantes(studentRepository);
const studentController = new StudentController(getAllStudents);

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Endpoints for managing students
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Estudiante 1
 *                   email:
 *                     type: string
 *                     example: estudiante1@mail.com
 *                   rol:
 *                     type: string
 *                     example: EST
 *                   face_id:
 *                     type: string
 *                     example: faceId123
 */
router.get('/students', (req, res, next) =>
  studentController.getAll(req, res, next),
);

export { router as studentRoutes };
