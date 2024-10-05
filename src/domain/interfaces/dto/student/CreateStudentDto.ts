import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateStudentDTO {
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
  @IsNotEmpty()
  face_id: string;

  constructor(nombre: string, email: string, rol: string, face_id: string) {
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
    this.face_id = face_id;
  }
}
