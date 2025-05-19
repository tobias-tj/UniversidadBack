import { ReportById } from '../../entities/ReportById';
import { ReportDay } from '../../entities/ReportDay';
import { ReportMonth } from '../../entities/ReportMonth';

export interface ReportsRepo {
  getAllReportByIdRelation(
    idRelacion: number,
    connectionDb: string,
  ): Promise<ReportById[]>;
  getAllReportPerDay(days: string): any;
  getReportDays(connectionDb: string): Promise<ReportDay>;
  getReportMonths(connectionDb: string): Promise<ReportMonth>;
}
