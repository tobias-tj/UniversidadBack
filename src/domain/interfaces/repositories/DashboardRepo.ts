import { newStudent } from '../../entities/newStudent';
import { ReportResume } from '../../entities/ReportResume';

export interface DashboardRepo {
  getStudentIncident(
    connectionDb: string,
    isCount?: boolean,
    filters?: any
  ): Promise<{ data: newStudent[]; totalCount: number }>;
  
  getIncidentsByStudentId(
    connectionDb: string,
    string: String,
  ): Promise<ReportResume[]>;
  getAllStudentsCount(connectionDb: string): Promise<any>;
}
