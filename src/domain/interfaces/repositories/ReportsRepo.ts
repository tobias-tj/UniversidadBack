import { ReportById } from '../../entities/ReportById';

export interface ReportsRepo {
  getAllReportByIdRelation(
    idRelacion: number,
    connectionDb: string,
  ): Promise<ReportById[]>;
  getAllReportPerDay(days: string): any;
}
