import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import { PolicyHandler } from './policy.handler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    let canAccess;
    try {
      const { user } = GqlExecutionContext.create(context).getContext().req;
      const storedUser = await this.userRepository.findOneOrFail(user.id, {
        relations: ['permissions'],
      });
      const ability = this.caslAbilityFactory.createForUser(storedUser);

      canAccess = policyHandlers.every(handler =>
        this.execPolicyHandler(handler, ability),
      );
    } catch (error) {
      canAccess = false;
      console.log('Error in canActivate function: ', error);
    }
    return canAccess;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
