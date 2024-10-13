import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExamDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  constructor(id: number, fecha: string, estado: string, courseName: string) {
    this.id = id;
    this.fecha = fecha;
    this.estado = estado;
    this.courseName = courseName;
  }
}
