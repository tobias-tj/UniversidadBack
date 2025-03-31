import { Exam } from '../../domain/entities/Exam';
import { ExamRepo } from '../../domain/interfaces/repositories/ExamRepo';

export class CreateExam {
  constructor(private examRepo: ExamRepo) {}

  async execute(exam: Exam, connectionDb: string) {
    return await this.examRepo.create(exam, connectionDb);
  }
}
