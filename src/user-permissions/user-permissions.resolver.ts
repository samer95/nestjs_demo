import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermission } from './entities/user-permission.entity';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../casl/policies.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../enums/action.enum';
import { Permission } from '../permissions/entities/permission.entity';

@Resolver(() => UserPermission)
@UseGuards(PoliciesGuard)
@UseGuards(JwtAuthGuard)
export class UserPermissionsResolver {
  constructor(private readonly userPermissionsService: UserPermissionsService) {}

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Permission))
  @Query(() => [UserPermission], { name: 'userPermissions' })
  findAll() {
    return this.userPermissionsService.findAll();
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Permission))
  @Query(() => UserPermission, { name: 'userPermission' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userPermissionsService.findOne(id);
  }
}
