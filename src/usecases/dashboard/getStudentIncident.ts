import { DashboardRepository } from '../../infrastructure/repositories/dashboard/dashboardRepository';

export class GetStudentIncident {
  constructor(private dashboardRepo: DashboardRepository) {}

  async execute(connectionDb: string, isCount = false, filters: any = {}) {
    return await this.dashboardRepo.getStudentIncident(connectionDb, isCount, filters);
  }
}
