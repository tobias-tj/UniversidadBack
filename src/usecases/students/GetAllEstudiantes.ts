import { Student } from "../../domain/entities/Student";
import { StudentRepo } from "../../domain/interfaces/StudentRepo";

export class GetAllEstudiantes {
  constructor(private studentRepo: StudentRepo) {}

  async execute() {
    return await this.studentRepo.findAll();
  }
}
