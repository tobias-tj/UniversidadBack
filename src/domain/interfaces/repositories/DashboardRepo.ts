import { ReportResume } from '../../entities/ReportResume';

export interface DashboardRepo {
  getStudentIncident(isCount?: boolean): Promise<ReportResume[]>;
  getIncidentsByExamId(string: String): Promise<ReportResume[]>
  getAllStudentsCount(): Promise<any>;
}
