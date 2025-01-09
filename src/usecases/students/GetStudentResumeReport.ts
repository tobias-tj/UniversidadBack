import { StudentRepo } from '../../domain/interfaces/repositories/StudentRepo';

export class GetStudentResumeReport {
  constructor(private studentRepo: StudentRepo) {}

  async execute(
    idUniversidad: number,
    idUsuario: number,
    fechaInicio: string,
    fechaFin: string,
  ) {
    return await this.studentRepo.getReportResume(
      idUniversidad,
      idUsuario,
      fechaInicio,
      fechaFin,
    );
  }
}
