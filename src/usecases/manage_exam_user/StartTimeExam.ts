import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class CreateStartTime {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(createdId: number) {
    return await this.manageExamUser.createStartTime(createdId);
  }
}
