import { ManageExamIncidentRepo } from '../../domain/interfaces/repositories/ManageExamIncidentRepo';

export class ManageExamIncident {
  constructor(private manageExamIncidentRepo: ManageExamIncidentRepo) {}

  async execute(
    createId: number,
    incidentType: string,
    time: Date,
    img: string,
    connectionDb: string,
  ): Promise<void> {
    await this.manageExamIncidentRepo.createIncident(
      createId,
      incidentType,
      time,
      img,
      connectionDb,
    );
  }
}
