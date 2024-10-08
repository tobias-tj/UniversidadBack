import { Exam } from '../../domain/entities/Exam';
import { ExamRepo } from '../../domain/interfaces/repositories/ExamRepo';

export class CreateExam {
  constructor(private examRepo: ExamRepo) {}

  async execute(exam: Exam) {
    return await this.examRepo.create(exam);
  }
}
