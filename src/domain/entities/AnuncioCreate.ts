export class AnuncioCreate {
  constructor(
    public title: string,
    public description: string,
    public visto?: boolean,
  ) {}
}
