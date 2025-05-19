import { Anuncios } from '../../entities/Anuncios';

export interface AnuncioRepo {
  getAnuncios(connectionDb: string, onlyUnread: boolean): Promise<Anuncios[]>;
  updateAnuncioById(id: number, connectionDb: string): Promise<boolean>;
}
