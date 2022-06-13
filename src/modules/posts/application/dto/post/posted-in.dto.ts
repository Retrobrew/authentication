export class PostedInDto {
  public readonly uuid: string;
  public readonly name: string;


  constructor(uuid: string, name: string) {
    this.uuid = uuid;
    this.name = name;
  }
}