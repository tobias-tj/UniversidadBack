import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExamDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  constructor(id: number, descripcion: string, fecha: string, estado: string) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.estado = estado;
  }
}
