import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { HttpException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Certificate } from '../certificates/entities/certificate.entity';
import { UpdateUserPermissionsInput } from './dto/update-user-permissions.input';
import { UserPermission } from '../user-permissions/entities/user-permission.entity';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../common/enums/action.enum';
import { ObjectsKeys } from '../permissions/constants/objects.constant';
import { EventsGateway } from '../events/events.gateway';
import { ConnectionMode, Web3Util } from '../common/utils';
import { ConfigService } from '@nestjs/config';

@Resolver(() => User)
@UseGuards(PoliciesGuard)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsGateway: EventsGateway,
    private readonly configService: ConfigService,
  ) {}

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @ResolveField(returns => Certificate)
  certificate(@Parent() user: User): Promise<Certificate> {
    if (!user.certificate_id) return null;

    return this.usersService.getCertificate(user.certificate_id);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @Mutation(() => [UserPermission])
  updateUserPermissions(
    @Args('updateUserPermissionsInput')
    updateUserPermissionsInput: UpdateUserPermissionsInput,
  ): Promise<UserPermission[]> {
    let errValue = '';
    updateUserPermissionsInput.permissions.forEach(permission => {
      if (!Object.values(Action).includes(permission.action)) {
        errValue = `action: ${permission.action}`;
      }
      if (!Object.values(ObjectsKeys).includes(permission.object)) {
        errValue = `object: ${permission.object}`;
      }
      if (!!errValue) {
        throw new HttpException(`The value of ${errValue} isn't valid.`, 422);
      }
    });
    return this.usersService.updatePermissions(updateUserPermissionsInput);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => String)
  async startBlockHeaderSubscription() {
    const web3Obj = new Web3Util(this.configService, ConnectionMode.WSS);
    try {
      await web3Obj.subscribeBlockHeaders(data => {
        this.eventsGateway.to(15).emit('events', data);
      });
      return 'Subscription has been started successfully.';
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
