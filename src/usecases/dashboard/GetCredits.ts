import { Credits } from '../../domain/entities/Credits';
import { IncidentsCount } from '../../domain/entities/IncidentsCount';
import { DashboardRepo } from '../../domain/interfaces/repositories/DashboardRepo';
import { DashboardRepository } from '../../infrastructure/repositories/dashboard/dashboardRepository';
export class GetCredits {
  constructor(private dashboardRepo: DashboardRepo) {}

  async execute(idUniversidad: number): Promise<Credits> {
    return await this.dashboardRepo.getCreditsByUniversity(idUniversidad);
  }
}
