import { ReportResume } from '../../domain/entities/ReportResume';
import { DashboardRepo } from '../../domain/interfaces/repositories/DashboardRepo';

export class GetIncidentsByStudentId {
  constructor(private dashboardRepo: DashboardRepo) {}

  async execute(id: string): Promise<ReportResume[]> {
    return await this.dashboardRepo.getIncidentsByStudentId(id);
  }
}
