import { AdminRepo } from '../../domain/interfaces/repositories/AdminRepo';

export class GetUniversity {
  constructor(private adminRepo: AdminRepo) {}

  async execute() {
    return await this.adminRepo.getUniversity();
  }
}
