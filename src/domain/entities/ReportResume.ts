import { Exam } from "./Exam";

export class ReportResume {
    constructor(
      public readonly id: number,
      public id_examenes_usuarios: string,
      public imagenes_base64: string,
      public tipo_incidencia: string,
      public fecha_captura: string,
      public score: string,
      public dominio_referencia: string,
      public examenes_usuario: Exam
    ) {}
  }
  