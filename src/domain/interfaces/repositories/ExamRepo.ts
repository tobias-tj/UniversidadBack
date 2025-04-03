import { Exam } from '../../entities/Exam';

export interface ExamRepo {
  create(exam: Exam, connectionDb: string): Promise<boolean>;
  findById(id: number, connectionDb: string): Promise<Exam | null>;
}
