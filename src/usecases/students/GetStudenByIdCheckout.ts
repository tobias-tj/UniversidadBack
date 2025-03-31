import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class GetStudentByIdCheckout {
  constructor(private studentRepo: StudentRepo) {}

  async execute(id: number, connectionDb: string) {
    return await this.studentRepo.findByIdCheckout(id, connectionDb);
  }
}
