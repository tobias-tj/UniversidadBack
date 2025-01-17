export class ReportById {
  constructor(
    public tipo_incidencia: string,
    public fecha_captura: Date,
    public imagenes_base64: string,
    public score: number,
  ) {}
}
