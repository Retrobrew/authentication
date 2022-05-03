import { EntityRepository } from "@mikro-orm/mysql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Groups } from "src/modules/groups/domain/entities/groups.entity";
import { UsersService } from "src/modules/users/application/services/users.service";
import { CreateGroupDto } from "../../dto/groups/create-group.dto";

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Groups)
        private readonly groupsRepository : EntityRepository<Groups>,
        private readonly userService: UsersService
    ) {}
    
    async create(request : CreateGroupDto): Promise<Groups> {

        let user = await this.userService.findOneByUuid(request.userUuid)

        const group = new Groups(
            randomUUID(),
            request.name,
            request.picture,
            new Date(),
            request.description,
            request.isProject,
            user
        )

        await this.groupsRepository.persistAndFlush(group)

        return group;

    }

}