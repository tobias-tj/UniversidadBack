import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class GetStudentByIdCheckout {
  constructor(private studentRepo: StudentRepo) {}

  async execute(id: number) {
    return await this.studentRepo.findByIdCheckout(id);
  }
}
