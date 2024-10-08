import { Student } from '../../domain/entities/Student';
import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class UpdateStudent {
  constructor(private studentRepo: StudentRepo) {}

  async execute(student: Student) {
    return await this.studentRepo.update(student);
  }
}
