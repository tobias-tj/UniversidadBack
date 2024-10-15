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
import { FindMatchStudentExam } from '../../usecases/manage_exam_user/FindMatchStudentExam';
import { CreateExamUser } from '../../usecases/manage_exam_user/CreateExamUser';

export class FirstProcessController {
  constructor(
    private createStudentUsecase: CreateStudent,
    private findStudentByIdUseCase: GetStudentById,
    private createExamUseCase: CreateExam,
    private findExamByIdUseCase: GetExamById,
    private findMatchStudentExam: FindMatchStudentExam,
    private createExamUserUsecase: CreateExamUser,
  ) {}

  async handleExamProcess(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req);
      const {
        estado,
        idFormulario,
        idUsuario,
        rol,
        fullname,
        courseName,
        email,
      } = req.body;

      const createExamDTO = new CreateExamDTO(
        idFormulario,
        new Date().toISOString(),
        estado,
        courseName,
      );

      const createStudentDto = new CreateStudentDTO(
        idUsuario,
        rol,
        fullname,
        email,
      );

      const existingMatch = await this.findMatchStudentExam.execute(
        createExamDTO.id,
        createStudentDto.id,
      );

      if (existingMatch) {
        // Caso 4: Usuario y Examen Existente -> Proceso Invalido
        return res.status(403).json({
          message:
            'El usuario ya ha realizado este examen, no puede realizarlo nuevamente.',
        });
      }

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
      }

      if (existingStudent && !existingExam) {
        // Caso 2: Usuario Existente, Nuevo Examen
        await this.createExamUseCase.execute(
          ExamMapper.toEntity(createExamDTO),
        );
      }

      if (!existingStudent && existingExam) {
        // Caso 3: Nuevo Usuario, Examen Existente
        await this.createStudentUsecase.execute(
          StudentMapper.toEntity(createStudentDto),
        );
      }

      const createdId = await this.createExamUserUsecase.execute(
        createExamDTO.id,
        createStudentDto.id,
      );

      if (createdId == null) {
        // Algun Conflicto con los datos
        return res.status(409);
      }

      return res.status(201).json({
        createdId: createdId,
      });
    } catch (error) {
      next(error);
    }
  }
}
