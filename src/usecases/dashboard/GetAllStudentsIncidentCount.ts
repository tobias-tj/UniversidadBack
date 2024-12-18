import { ReportResume } from '../../domain/entities/ReportResume';
import { IncidentsCount } from '../../domain/entities/IncidentsCount';
import { DashboardRepo } from '../../domain/interfaces/repositories/DashboardRepo';
import { DashboardRepository } from '../../infrastructure/repositories/dashboard/dashboardRepository';
export class GetAllStudentsIncidentCount {
  constructor(private dashboardRepo: DashboardRepo) {}

  async execute(): Promise<IncidentsCount> {
    return await this.dashboardRepo.getAllStudentsCount();
  }
}
