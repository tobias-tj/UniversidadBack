import { ReporteForMonth, ReportMonth } from '../domain/entities/ReportMonth';

const mesesSemanaMap: Record<string, string> = {
  June: 'Junio',
  July: 'Julio',
  August: 'Agosto',
  September: 'Septiembre',
  October: 'Octubre',
  November: 'Noviembre',
  December: 'Diciembre',
  January: 'Enero',
  February: 'Febrero',
  March: 'Marzo',
  April: 'Abril',
  May: 'Mayo',
};

export function mapearDatosReportMonth(rawData: any[]): ReportMonth {
  const lista: ReporteForMonth[] = rawData.map((item) => ({
    mes: mesesSemanaMap[item.mes.trim()],
    examenesConReportes: item.examenes_con_reportes,
    examenesSinReportes: item.examenes_sin_reportes,
  }));

  return new ReportMonth(lista);
}
