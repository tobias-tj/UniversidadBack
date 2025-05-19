export class ReportMonth {
  constructor(public lista: ReporteForMonth[]) {}
}

export interface ReporteForMonth {
  mes: string; // 'Enero', 'Febrero', etc.
  examenesConReportes: number;
  examenesSinReportes: number;
}
