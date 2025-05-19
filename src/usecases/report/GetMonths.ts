import { ReportMonth } from '../../domain/entities/ReportMonth';
import { ReportsRepo } from '../../domain/interfaces/repositories/ReportsRepo';

export class GetReportMonths {
  constructor(private reportsRepo: ReportsRepo) {}

  async execute(connectionDb: string): Promise<ReportMonth> {
    return await this.reportsRepo.getReportMonths(connectionDb);
  }
}
