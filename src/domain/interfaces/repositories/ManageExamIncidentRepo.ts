export interface ManageExamIncidentRepo {
  createIncident(
    createId: number,
    incidentType: string,
    time: Date,
    screen: string,
  ): Promise<void>;
}
