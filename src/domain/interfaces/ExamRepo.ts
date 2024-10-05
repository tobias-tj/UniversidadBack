import { Exam } from '../entities/Exam';

export interface ExamRepo {
  create(exam: Exam): Promise<Exam>;
}
