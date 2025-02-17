import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { AuthModule } from 'src/auth/auth.module';
import { Reference } from 'src/references/references.model';
import { Document } from 'src/documents/document.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesModule } from 'src/roles/roles.module';
import { UserRoles } from 'src/roles/user-roles.model';
import { Role } from 'src/roles/roles.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Reference, Document]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService]
})
export class UsersModule {}
