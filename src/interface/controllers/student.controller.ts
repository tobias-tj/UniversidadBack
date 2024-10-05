import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../domain/interfaces/middleware/errorHandler';
import { CreateStudent } from '../../usecases/students/CreateStudent';
import { CreateStudentDTO } from '../../domain/interfaces/dto/student/CreateStudentDto';
import { validate } from 'class-validator';
import { Student } from '../../domain/entities/Student';
import { UpdateStudentDto } from '../../domain/interfaces/dto/student/UpdateStudentDto';
import { CreateExam } from '../../usecases/exam/CreateExam';
import { CreateExamDTO } from '../../domain/interfaces/dto/exam/CreateExamDto';
import { Exam } from '../../domain/entities/Exam';
import { validationResult } from 'express-validator';
import { StudentMapper } from '../../mappers/StudentMapper';
import { ExamMapper } from '../../mappers/ExamMapper';

export class StudentController {
  constructor(
    private createStudentUsecase: CreateStudent,
    private createExamUseCase: CreateExam,
  ) {}

  async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      // Validar errores del middleware express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        formUrl,
        descripcion,
        estado,
        idFormulario,
        idUsuario,
        nombre,
        cedula,
        email,
        rol,
      } = req.body;

      const createExamDTO = new CreateExamDTO(
        idFormulario,
        descripcion,
        new Date().toISOString(),
        estado,
        formUrl,
      );
      const newExam = ExamMapper.toEntity(createExamDTO);

      // Se supone que faceId en otro lugar tenemos que rellenar
      const createStudentDto = new CreateStudentDTO(
        idUsuario,
        nombre,
        email,
        rol,
        '',
        cedula,
      );
      const newStudent = StudentMapper.toEntity(createStudentDto);

      // Creamos el estudiante y el examen
      const createStudent = await this.createExamUseCase.execute(newExam);
      const createdExam = await this.createStudentUsecase.execute(newStudent);

      // Devolver respuesta exitosa
      res.status(201).json({
        message: 'Examen y estudiante creados con éxito',
        createStudent,
        createdExam,
      });

      // Redireccionar a Front 2
      //res.redirect('http://localhost:5173/');
    } catch (error) {
      next(error);
    }
  }
}
