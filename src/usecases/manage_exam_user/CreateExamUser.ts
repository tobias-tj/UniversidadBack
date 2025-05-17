import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class CreateExamUser {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(
    idExamen: number,
    idUsuario: number,
    connectionDb: string,
    idUniversidad: number,
  ) {
    return await this.manageExamUser.create(
      idExamen,
      idUsuario,
      connectionDb,
      idUniversidad,
    );
  }
}
