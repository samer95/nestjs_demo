import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesResolver } from './certificates.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { User } from '../users/entities/user.entity';
import { CaslModule } from '../casl/casl.module';
import { CertificatesController } from './certificates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, User]), CaslModule],
  providers: [CertificatesResolver, CertificatesService],
  exports: [CertificatesService],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
