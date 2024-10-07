import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateStudentDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsString()
  @IsOptional()
  face_id?: string;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  constructor(
    id: number,
    nombre: string,
    email: string,
    rol: string,
    face_id: string,
    cedula: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
    this.face_id = face_id;
    this.cedula = cedula;
  }
}
