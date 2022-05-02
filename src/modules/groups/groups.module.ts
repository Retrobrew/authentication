import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Groups } from './domain/entities/groups.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Groups] }),
    forwardRef(() => AuthenticationModule)
  ],
  controllers: [
  ],
  providers: [
  ]
})
export class GroupsModule {}