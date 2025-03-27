import { AnuncioCreate } from '../../entities/AnuncioCreate';
import { Anuncios } from '../../entities/Anuncios';

export interface AnuncioRepo {
  getAnuncios(connectionDb: string): Promise<Anuncios[]>;
  createAnuncio(data: AnuncioCreate): Promise<boolean>;
  updateAnuncioById(id: number, connectionDb: string): Promise<boolean>;
}
