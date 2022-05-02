import { EntityRepository } from "@mikro-orm/mysql";
import { Groups } from "src/modules/groups/domain/entities/groups.entity";

export class GroupService {
    constructor(
       private readonly groupRepository: EntityRepository<Groups> 
    ) {}

    
    async createGroup() : Promise<void> {
        
    }


}