import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class CreateStartTime {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(createdId: number, connectionDb: string) {
    return await this.manageExamUser.createStartTime(createdId, connectionDb);
  }
}
