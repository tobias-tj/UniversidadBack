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
  rol: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  constructor(id: number, rol: string, fullname: string, email: string) {
    this.id = id;
    this.rol = rol;
    this.fullname = fullname;
    this.email = email;
  }
}
