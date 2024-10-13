import { CreateStudentDTO } from '../domain/interfaces/dto/student/CreateStudentDto';
import { Student } from '../domain/entities/Student';

export class StudentMapper {
  static toEntity(dto: CreateStudentDTO): Student {
    return new Student(dto.id, dto.fullname, dto.email, dto.rol);
  }
}
