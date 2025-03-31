export interface ManageExamUserRepo {
  create(
    idExamen: number,
    idUsuario: number,
    connectionDb: string,
  ): Promise<number | null>;
  createFaceId(idFace: string, idUser: number): Promise<boolean>;
  createStartTime(creationId: number): Promise<boolean>;
  createFinishTime(creationId: number): Promise<boolean>;
  findMatchUserAndExam(
    idExamen: number,
    idUsuario: number,
    connectionDb: string,
  ): Promise<boolean>;
}
