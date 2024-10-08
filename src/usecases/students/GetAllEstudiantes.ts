import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class GetAllEstudiantes {
  constructor(private studentRepo: StudentRepo) {}

  async execute() {
    return await this.studentRepo.findAll();
  }
}
