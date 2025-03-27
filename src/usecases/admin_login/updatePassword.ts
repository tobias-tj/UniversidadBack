import { AdminRepo } from '../../domain/interfaces/repositories/AdminRepo';

export class UpdatePassword {
  constructor(private adminRepo: AdminRepo) {}

  async execute() {
    return await this.adminRepo.updatePassword();
  }
}
