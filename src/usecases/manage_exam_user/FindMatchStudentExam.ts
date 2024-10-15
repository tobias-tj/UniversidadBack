import { ManageExamUserRepo } from '../../domain/interfaces/repositories/ManageExamUserRepo';

export class FindMatchStudentExam {
  constructor(private manageExamUser: ManageExamUserRepo) {}

  async execute(idExamen: number, idUsuario: number) {
    return await this.manageExamUser.findMatchUserAndExam(idExamen, idUsuario);
  }
}
