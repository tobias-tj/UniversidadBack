import { Anuncios } from '../../domain/entities/Anuncios';
import { AnuncioRepo } from '../../domain/interfaces/repositories/AnuncioRepo';

export class GetAnuncios {
  constructor(private anuncioRepo: AnuncioRepo) {}

  async execute(connectionDb: string): Promise<Anuncios[]> {
    try {
      return await this.anuncioRepo.getAnuncios(connectionDb);
    } catch (error) {
      throw new Error('Error ejecutando el caso de uso GetAnuncios');
    }
  }
}
