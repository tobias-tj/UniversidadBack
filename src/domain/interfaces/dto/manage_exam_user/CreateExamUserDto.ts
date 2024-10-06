import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExamUserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  constructor(id: number, code: number) {
    this.id = id;
    this.code = code;
  }
}
