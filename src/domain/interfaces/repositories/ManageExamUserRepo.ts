export interface ManageExamUserRepo {
  create(idExamen: number, idUsuario: number): Promise<boolean>;
}
