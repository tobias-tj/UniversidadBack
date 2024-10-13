import { Exam } from '../domain/entities/Exam';
import { CreateExamDTO } from '../domain/interfaces/dto/exam/CreateExamDto';

export class ExamMapper {
  static toEntity(dto: CreateExamDTO): Exam {
    return new Exam(dto.id, dto.courseName, dto.fecha, dto.estado);
  }
}
