export class ReportDay {
  constructor(public lista: ReportePorDia[]) {}
}

export interface ReportePorDia {
  dia: string; // 'Lunes', 'Martes', etc.
  examenesConReportes: number;
  examenesSinReportes: number;
}
