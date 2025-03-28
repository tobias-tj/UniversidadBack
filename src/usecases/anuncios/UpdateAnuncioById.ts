import { AnuncioRepo } from '../../domain/interfaces/repositories/AnuncioRepo';

export class UpdateAnuncioById {
  constructor(private anuncioRepo: AnuncioRepo) {}

  async execute(id: number, connectionDb: string): Promise<boolean> {
    return await this.anuncioRepo.updateAnuncioById(id, connectionDb);
  }
}
