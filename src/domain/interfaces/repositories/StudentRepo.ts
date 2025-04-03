import { ReportResume } from '../../entities/ReportResume';
import { Student } from '../../entities/Student';

export interface StudentRepo {
  findAll(): Promise<Student[]>;
  findById(id: number, connectionDb: string): Promise<Student | null>;
  create(student: Student, connectionDb: string): Promise<boolean>;
  update(student: Student): Promise<void>;
  findByIdCheckout(id: number, connectionDb: string): Promise<boolean>;
  getReportResume(
    idUniversidad: number,
    idUser: number,
    FechaInicio: string,
    FechaFin: string,
  ): Promise<ReportResume[]>;
}
