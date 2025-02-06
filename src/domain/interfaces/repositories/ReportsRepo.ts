import { ReportById } from '../../entities/ReportById';

export interface ReportsRepo {
  getAllReportByIdRelation(idRelacion: number): Promise<ReportById[]>;
  getAllReportPerDay(days:string):any;
}
