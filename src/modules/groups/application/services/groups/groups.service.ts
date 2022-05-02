import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Logger, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Groups } from "src/modules/groups/domain/entities/groups.entity";
import { CreateGroupDto } from "../../dto/groups/create-group.dto";

export class GroupService {
    constructor(
        @InjectRepository(Groups) private readonly groupRepository: EntityRepository<Groups> 
    ) {}

    
    async createGroup(request : CreateGroupDto) : Promise<void> {
        const group = new Groups(
            randomUUID(),
            request.name,
            request.picture,
            new Date(),
            request.description,
            request.isProject,
            request.createdBy
        )
    }

    private async getGroup(id: string): Promise<Groups> {
        let group = await this.groupRepository.findOne({ uuid: id }, { populate: true });
        if(!group) {
            Logger.error(
                `Erreur lors de la récupération du groupe ${id}`,
                '',
                this.constructor.name
              );
            throw new NotFoundException(`Groupe ${id} inconnu`)
        }

        return group;
    }

}