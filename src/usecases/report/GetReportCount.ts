import { ReportsRepo } from '../../domain/interfaces/repositories/ReportsRepo';

export class GetReportCount {
  constructor(private reportsRepo: ReportsRepo) {}

  async execute(days:string): Promise<any> {
    return await this.reportsRepo.getAllReportPerDay(days);
  }
}
