import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExamUserDTO {
  @IsNumber()
  @IsNotEmpty()
  formId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  constructor(id: number, code: number) {
    this.formId = id;
    this.userId = code;
  }
}
