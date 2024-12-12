import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class GetStudentIncident {
  constructor(private studentRepo: StudentRepo) {}

  async execute(isCount?: boolean) {
    return await this.studentRepo.getStudentIncident(isCount);
  }
}
