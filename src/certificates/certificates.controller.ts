import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PoliciesGuard } from '../casl/policies.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CertificatesService } from './certificates.service';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../enums/action.enum';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateInput } from './dto/create-certificate.input';
import { UpdateCertificateInput } from './dto/update-certificate.input';

@Controller('certificates')
@UseGuards(PoliciesGuard)
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Certificate),
  )
  async createCertificate(
    @Body() createCertificateInput: CreateCertificateInput,
  ): Promise<Certificate> {
    return this.certificatesService.create(createCertificateInput);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Certificate))
  async findAll(): Promise<Certificate[]> {
    return this.certificatesService.findAll();
  }

  @Get('/:id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Certificate))
  async getById(@Param('id') id: number): Promise<Certificate> {
    return this.certificatesService.findOne(id);
  }

  @Patch()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Certificate),
  )
  async updateCertificate(
    @Body() updateCertificateInput: UpdateCertificateInput,
  ): Promise<Certificate> {
    return this.certificatesService.update(
      updateCertificateInput.id,
      updateCertificateInput,
    );
  }

  @Delete('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Certificate),
  )
  async deleteCertificate(@Param('id') id: number): Promise<Certificate> {
    return this.certificatesService.remove(id);
  }
}
