import { ExamRepo } from '../../domain/interfaces/repositories/ExamRepo';

export class GetExamById {
  constructor(private examRepo: ExamRepo) {}

  async execute(id: number) {
    return await this.examRepo.findById(id);
  }
}
