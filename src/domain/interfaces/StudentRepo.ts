import { Student } from '../entities/Student';

export interface StudentRepo {
  findAll(): Promise<Student[]>;
  findById(id: number): Promise<Student | null>;
  create(student: Student): Promise<Student>;
  update(student: Student): Promise<void>;
}
