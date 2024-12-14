import { DashboardRepository } from '../../infrastructure/repositories/dashboard/dashboardRepository';

export class GetStudentIncident {
  constructor(private dashboardRepo: DashboardRepository) {}

  async execute(isCount?: boolean) {
    return await this.dashboardRepo.getStudentIncident(isCount);
  }
}
