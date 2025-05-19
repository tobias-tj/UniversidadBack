import { Anuncios } from '../../entities/Anuncios';

export interface AnuncioRepo {
  getAnuncios(connectionDb: string, onlyUnread: boolean): Promise<Anuncios[]>;
}
