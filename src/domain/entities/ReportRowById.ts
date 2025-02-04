export interface ReportRowById {
  dominio_referencia: string;
  fecha_captura: Date | null;
  imagenes_base64: string[];
  score: number;
}
