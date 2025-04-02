export interface ManageExamIncidentRepo {
  createIncident(
    createId: number,
    incidentType: string,
    time: Date,
    img: string,
    connectionDb: string,
  ): Promise<void>;
}
