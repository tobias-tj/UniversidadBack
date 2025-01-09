export interface ManageExamIncidentRepo {
  createIncident(
    createId: number,
    incidentType: string,
    time: Date,
    img: string,
  ): Promise<void>;
}
