export class ReportById {
  constructor(
    public dominio_referencia: string,
    public fecha_captura: Date,
    public imagenes_base64: string,
    public score: number,
  ) {}
}
