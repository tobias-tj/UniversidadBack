import { Exam } from '../../entities/Exam';

export interface ExamRepo {
  create(exam: Exam): Promise<boolean>;
  findById(id: number): Promise<Exam | null>;
}
