import { Student } from '../../domain/entities/Student';
import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class StudentFindAll {
  constructor(private studentRepo: StudentRepo) {}

  async execute() {
    return await this.studentRepo.findAll();
  }
}
