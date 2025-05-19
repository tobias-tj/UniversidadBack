import { ReportDay, ReportePorDia } from '../domain/entities/ReportDay';

const diasSemanaMap: Record<string, string> = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

export function mapearDatosReport(rawData: any[]): ReportDay {
  const lista: ReportePorDia[] = rawData.map((item) => ({
    dia: diasSemanaMap[item.dia_semana.trim()],
    examenesConReportes: item.examenes_con_reportes,
    examenesSinReportes: item.examenes_sin_reportes,
  }));

  return new ReportDay(lista);
}
