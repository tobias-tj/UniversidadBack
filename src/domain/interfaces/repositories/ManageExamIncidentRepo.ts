export interface ManageExamIncidentRepo {
    createIncident(createId: number, incidentType: string, time: Date): Promise<void>;
  }
  