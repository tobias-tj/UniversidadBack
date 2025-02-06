import { AdminRepo } from "../../domain/interfaces/repositories/AdminRepo";

export class Login {
  constructor(private adminRepo: AdminRepo) {}

  async execute(idUniversidad:number, user:string, password:string) {
    return await this.adminRepo.login(idUniversidad, user, password);
  }
}
