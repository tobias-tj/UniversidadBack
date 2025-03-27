import { newStudent } from '../../entities/newStudent';
import { ReportResume } from '../../entities/ReportResume';

export interface DashboardRepo {
  getStudentIncident(isCount?: boolean): Promise<newStudent[]>;
  getIncidentsByStudentId(string: String): Promise<ReportResume[]>;
  getAllStudentsCount(connectionDb: string): Promise<any>;
}
