import { AnuncioCreate } from '../../domain/entities/AnuncioCreate';
import { AnuncioRepo } from '../../domain/interfaces/repositories/AnuncioRepo';

export class CreateAnuncio {
  constructor(private anuncioRepo: AnuncioRepo) {}

  async execute(data: AnuncioCreate): Promise<boolean> {
    return await this.anuncioRepo.createAnuncio(data);
  }
}
