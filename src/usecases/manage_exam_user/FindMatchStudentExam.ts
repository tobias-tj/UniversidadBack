import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class FindMatchStudentExam {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(idExamen: number, idUsuario: number, connectionDb: string) {
    return await this.manageExamUser.findMatchUserAndExam(
      idExamen,
      idUsuario,
      connectionDb,
    );
  }
}
