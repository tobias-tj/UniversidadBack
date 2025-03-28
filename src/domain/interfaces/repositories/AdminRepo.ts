import { UniversityList } from '../../entities/UniversityList';

export interface AdminRepo {
  login(
    idUniversidad: number,
    email: string,
    password: string,
  ): Promise<string | undefined>;
  getUniversity(): Promise<UniversityList[]>;
}
