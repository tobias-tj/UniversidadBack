import { ReportById } from '../../domain/entities/ReportById';
import { ReportsRepo } from '../../domain/interfaces/repositories/ReportsRepo';

export class GetAllReportByIdRelation {
  constructor(private reportsRepo: ReportsRepo) {}

  async execute(idRelacion: number): Promise<ReportById[]> {
    return await this.reportsRepo.getAllReportByIdRelation(idRelacion);
  }
}
