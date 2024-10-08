import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class CreateFaceId {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(idFace: string, idUser: number) {
    return await this.manageExamUser.createFaceId(idFace, idUser);
  }
}
