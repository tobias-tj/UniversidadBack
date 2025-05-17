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
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

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
      const { estado, rol, token } = req.body;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);

      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      if (!decoded?.idUniversidad) {
        return res.status(401).json({ error: 'Token inválido falta IDs' });
      }

      const createExamDTO = new CreateExamDTO(
        decoded?.formId!,
        new Date().toISOString(),
        estado,
        decoded?.courseName!,
      );

      const fullName = `${decoded?.firstname} ${decoded?.lastname}`;

      const createStudentDto = new CreateStudentDTO(
        Number(decoded?.userId!),
        rol,
        fullName,
        decoded?.email!,
      );

      const existingMatch = await this.findMatchStudentExam.execute(
        createExamDTO.id,
        createStudentDto.id,
        decoded.connectionDb,
      );

      if (existingMatch) {
        // Caso 4: Usuario y Examen Existente -> Proceso Invalido
        return res.status(403).json({
          message:
            'El usuario ya ha realizado este examen, no puede realizarlo nuevamente.',
        });
      }

      const [existingStudent, existingExam] = await Promise.all([
        this.findStudentByIdUseCase.execute(
          Number(decoded?.userId!),
          decoded.connectionDb,
        ),
        this.findExamByIdUseCase.execute(
          decoded?.formId!,
          decoded.connectionDb,
        ),
      ]);

      // Logica para los diferentes casos:
      if (!existingExam && !existingStudent) {
        // Caso 1: Nuevo Usuario, Nuevo Examen
        await Promise.all([
          this.createExamUseCase.execute(
            ExamMapper.toEntity(createExamDTO),
            decoded.connectionDb,
          ),
          this.createStudentUsecase.execute(
            StudentMapper.toEntity(createStudentDto),
            decoded.connectionDb,
          ),
        ]);
      }

      if (existingStudent && !existingExam) {
        // Caso 2: Usuario Existente, Nuevo Examen
        await this.createExamUseCase.execute(
          ExamMapper.toEntity(createExamDTO),
          decoded.connectionDb,
        );
      }

      if (!existingStudent && existingExam) {
        // Caso 3: Nuevo Usuario, Examen Existente
        await this.createStudentUsecase.execute(
          StudentMapper.toEntity(createStudentDto),
          decoded.connectionDb,
        );
      }

      const createdId = await this.createExamUserUsecase.execute(
        createExamDTO.id,
        createStudentDto.id,
        decoded.connectionDb,
        decoded.idUniversidad,
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
