import { NextFunction, Request, Response } from 'express';
import { GetAllEstudiantes } from '../../usecases/students/GetAllEstudiantes';
import { CustomError } from '../../domain/interfaces/middleware/errorHandler';
import { CreateStudent } from '../../usecases/students/CreateStudent';
import { CreateStudentDTO } from '../../domain/interfaces/dto/student/CreateStudentDto';
import { validate } from 'class-validator';
import { Student } from '../../domain/entities/Student';
import { GetStudentById } from '../../usecases/students/GetStudentById';
import { UpdateStudent } from '../../usecases/students/UpdateStudent';
import { UpdateStudentDto } from '../../domain/interfaces/dto/student/UpdateStudentDto';

export class StudentController {
  constructor(
    private getAllEstudiantesUseCase: GetAllEstudiantes,
    private getStudentByIdUsecase: GetStudentById,
    private createStudentUsecase: CreateStudent,
    private updateStudentUsecase: UpdateStudent,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const estudiantes = await this.getAllEstudiantesUseCase.execute();
      res.json(estudiantes);

      if (!estudiantes || estudiantes.length === 0) {
        const error: CustomError = new Error(
          'No se ha encontrado estudiantes!',
        );
        error.status = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  }

  async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        const error: CustomError = new Error('El id no puede estar vacío');
        error.status = 400;
        return next(error);
      }

      const studentById = await this.getStudentByIdUsecase.execute(Number(id));

      res.status(200).json(studentById);
    } catch (error) {
      const serverError: CustomError = new Error('Error interno del servidor');
      serverError.status = 500;
      return next(serverError);
    }
  }

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, email, rol, face_id } = req.body;

      // Creamos la instancia del DTO
      const createStudentDTO = new CreateStudentDTO(
        nombre,
        email,
        rol,
        face_id,
      );

      // Validar el DTO
      const error = await validate(createStudentDTO);

      // Si hay errores devolvemos una respuesta con el detalle
      if (error.length > 0) {
        const error: CustomError = new Error(
          'Error en los datos para crear un usuario',
        );
        error.status = 400;
        return next(error);
      }

      const newStudent = new Student(
        0,
        createStudentDTO.nombre,
        createStudentDTO.email,
        createStudentDTO.rol,
        createStudentDTO.face_id,
      );

      const createdStudent =
        await this.createStudentUsecase.execute(newStudent);

      res.status(201).json(createdStudent);
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, nombre, email, rol, face_id } = req.body;

      const updateStudentDto = new UpdateStudentDto(
        id,
        nombre,
        email,
        rol,
        face_id,
      );

      const validationError = await validate(updateStudentDto);

      if (validationError.length > 0) {
        const error: CustomError = new Error(
          'Error en los datos para actualizar un usuario',
        );
        error.status = 400;
        return next(error);
      }

      const updatedStudent = new Student(
        id,
        updateStudentDto.nombre,
        updateStudentDto.email,
        updateStudentDto.rol,
        updateStudentDto.face_id,
      );

      await this.updateStudentUsecase.execute(updatedStudent);

      res.status(200).json({ message: 'Usuario actualizado con exito' });
    } catch (error) {
      next(error);
    }
  }
}
