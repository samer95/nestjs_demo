import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CertificatesService } from './certificates.service';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateInput } from './dto/create-certificate.input';
import { UpdateCertificateInput } from './dto/update-certificate.input';
import { User } from '../users/entities/user.entity';
import { PoliciesGuard } from '../casl/policies.guard';
import { UseGuards } from '@nestjs/common';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../common/enums/action.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Certificate)
@UseGuards(PoliciesGuard)
@UseGuards(JwtAuthGuard)
export class CertificatesResolver {
  constructor(private readonly certificatesService: CertificatesService) {}

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Certificate),
  )
  @Mutation(() => Certificate)
  createCertificate(
    @Args('createCertificateInput')
    createCertificateInput: CreateCertificateInput,
  ) {
    return this.certificatesService.create(createCertificateInput);
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Certificate))
  @Query(() => [Certificate], { name: 'certificates' })
  findAll() {
    return this.certificatesService.findAll();
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Certificate))
  @Query(() => Certificate, { name: 'certificate' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.certificatesService.findOne(id);
  }

  @ResolveField(returns => [User])
  users(@Parent() certificate: Certificate): Promise<User[]> {
    return this.certificatesService.getUsers(certificate.id);
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Certificate),
  )
  @Mutation(() => Certificate)
  updateCertificate(
    @Args('updateCertificateInput')
    updateCertificateInput: UpdateCertificateInput,
  ) {
    return this.certificatesService.update(
      updateCertificateInput.id,
      updateCertificateInput,
    );
  }

  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Certificate),
  )
  @Mutation(() => Certificate)
  removeCertificate(@Args('id', { type: () => Int }) id: number) {
    return this.certificatesService.remove(id);
  }
}
