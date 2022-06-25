import { Groups } from '../../../../groups/domain/entities/groups.entity';

export class PostedInDto {
  public uuid: string;
  public name: string;

  constructor(group?: Groups) {
    if(!group){
      return;
    }

    this.uuid = group.getUuid();
    this.name = group.getName();

    if(group.getUuid() === "home") {
      this.name = group.getUuid();
    }
  }

}