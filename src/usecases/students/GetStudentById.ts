import { StudentRepo } from '../../domain/interfaces/StudentRepo';

export class GetStudentById {
  constructor(private studentRepo: StudentRepo) {}

  async execute(id: number) {
    return await this.studentRepo.findById(id);
  }
}
