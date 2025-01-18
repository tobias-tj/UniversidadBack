import { ReportById } from '../domain/entities/ReportById';
import { ReportRowById } from '../domain/entities/ReportRowById';

export function reportMapperById(row: ReportRowById): ReportById {
  return {
    dominio_referencia: row.dominio_referencia || '',
    fecha_captura: row.fecha_captura || null,
    imagenes_base64: row.imagenes_base64 || '',
    score: row.score || 0,
  } as ReportById;
}
