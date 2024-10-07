import { NextFunction, Request, Response } from 'express';
import { CreateStudent } from '../../usecases/students/CreateStudent';
import { CreateStudentDTO } from '../../domain/interfaces/dto/student/CreateStudentDto';
import { CreateExam } from '../../usecases/exam/CreateExam';
import { CreateExamDTO } from '../../domain/interfaces/dto/exam/CreateExamDto';
import { validationResult } from 'express-validator';
import { StudentMapper } from '../../mappers/StudentMapper';
import { ExamMapper } from '../../mappers/ExamMapper';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { GetExamById } from '../../usecases/exam/GetExamById';

export class StartExamController {
  constructor(
    private createStudentUsecase: CreateStudent,
    private findStudentByIdUseCase: GetStudentById,
    private createExamUseCase: CreateExam,
    private findExamByIdUseCase: GetExamById,
  ) {}

  async handleExamProcess(req: Request, res: Response, next: NextFunction) {
    try {
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
      );

      const createStudentDto = new CreateStudentDTO(
        idUsuario,
        nombre,
        email,
        rol,
        '',
        cedula,
      );

      const redirectUrl = `http://localhost:5173/?formUrl=${encodeURIComponent(formUrl)}&id=${idFormulario}&code=${idUsuario}`;

      const [existingStudent, existingExam] = await Promise.all([
        this.findStudentByIdUseCase.execute(idUsuario),
        this.findExamByIdUseCase.execute(idFormulario),
      ]);

      // Logica para los diferentes casos:
      if (!existingExam && !existingStudent) {
        // Caso 1: Nuevo Usuario, Nuevo Examen
        await Promise.all([
          this.createExamUseCase.execute(ExamMapper.toEntity(createExamDTO)),
          this.createStudentUsecase.execute(
            StudentMapper.toEntity(createStudentDto),
          ),
        ]);
        return res.status(201).json({
          message: 'Nuevo estudiante y examen creados.',
          redirectUrl: redirectUrl,
          formUrl,
        });
      }

      if (existingStudent && !existingExam) {
        // Caso 2: Usuario Existente, Nuevo Examen
        await this.createExamUseCase.execute(
          ExamMapper.toEntity(createExamDTO),
        );
        return res.status(201).json({
          message: 'Examen nuevo creado para estudiante existente.',
          redirectUrl: redirectUrl,
          formUrl,
        });
      }

      if (!existingStudent && existingExam) {
        // Caso 3: Nuevo Usuario, Examen Existente
        await this.createStudentUsecase.execute(
          StudentMapper.toEntity(createStudentDto),
        );
        return res.status(201).json({
          message: 'Nuevo estudiante creado para examen existente.',
          redirectUrl: redirectUrl,
          formUrl,
        });
      }

      // Caso 4: Usuario y Examen Existente -> Proceso Invalido
      res.status(403).json({
        message:
          'El usuario ya ha realizado este examen, no puede realizarlo nuevamente.',
      });
    } catch (error) {
      next(error);
    }
  }
}
