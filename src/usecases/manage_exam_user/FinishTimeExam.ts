import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class CreateFinishTime {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(createdId: number) {
    return await this.manageExamUser.createFinishTime(createdId);
  }
}
