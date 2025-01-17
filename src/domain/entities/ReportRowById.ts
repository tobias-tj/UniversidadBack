export interface ReportRowById {
  tipo_incidencia: string;
  fecha_captura: Date | null;
  imagenes_base64: string;
  score: number;
}
