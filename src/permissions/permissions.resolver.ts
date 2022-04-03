import { Query, Resolver } from '@nestjs/graphql';
import { PERMISSIONS } from './permissions.data';
import { Permission } from './entities/permission.entity';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../casl/policies.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../common/enums/action.enum';

@Resolver(() => Permission)
@UseGuards(PoliciesGuard)
@UseGuards(JwtAuthGuard)
export class PermissionsResolver {
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Permission))
  @Query(() => [Permission], { name: 'permissions' })
  findAll() {
    return PERMISSIONS;
  }
}
