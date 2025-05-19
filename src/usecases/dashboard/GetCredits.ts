import { Credits } from '../../domain/entities/Credits';
import { DashboardRepo } from '../../domain/interfaces/repositories/DashboardRepo';
export class GetCredits {
  constructor(private dashboardRepo: DashboardRepo) {}

  async execute(idUniversidad: number): Promise<Credits> {
    return await this.dashboardRepo.getCreditsByUniversity(idUniversidad);
  }
}
