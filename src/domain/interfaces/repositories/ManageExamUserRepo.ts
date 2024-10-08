export interface ManageExamUserRepo {
  create(idExamen: number, idUsuario: number): Promise<number | null>;
  createFaceId(idFace: string, idUser: number): Promise<boolean>;
  createStartTime(creationId: number): Promise<boolean>;
}
