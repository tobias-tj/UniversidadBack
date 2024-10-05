import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  IsEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateStudentDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  nombre: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  rol: string;

  @IsString()
  @IsOptional()
  face_id: string;

  constructor(
    id: number,
    nombre: string,
    email: string,
    rol: string,
    face_id: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
    this.face_id = face_id;
  }
}
