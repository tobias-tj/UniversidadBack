import { ReportDay } from '../../domain/entities/ReportDay';
import { ReportsRepo } from '../../domain/interfaces/repositories/ReportsRepo';

export class GetReportDays {
  constructor(private reportsRepo: ReportsRepo) {}

  async execute(connectionDb: string): Promise<ReportDay> {
    return await this.reportsRepo.getReportDays(connectionDb);
  }
}
