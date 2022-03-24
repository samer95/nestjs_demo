import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesResolver } from './certificates.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, User])],
  providers: [CertificatesResolver, CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
