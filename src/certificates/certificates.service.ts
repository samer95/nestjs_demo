import { HttpException, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCertificateInput } from './dto/create-certificate.input';
import { UpdateCertificateInput } from './dto/update-certificate.input';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate) private certificateRepository: Repository<Certificate>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  create(createCertificateInput: CreateCertificateInput) {
    const certificateData = plainToInstance(
      CreateCertificateInput,
      createCertificateInput,
      { excludeExtraneousValues: true },
    );

    const newCertificate = this.certificateRepository.create(certificateData);
    return this.certificateRepository.save(newCertificate);
  }

  findAll() {
    return this.certificateRepository.find();
  }

  findOne(id: number, failOnNotFound = true) {
    if (failOnNotFound) {
      return this.certificateRepository.findOneOrFail(id);
    } else {
      return this.certificateRepository.findOne(id);
    }
  }

  getUsers(certificate_id: number): Promise<User[]> {
    return this.userRepository.find({ certificate_id });
  }

  update(id: number, updateCertificateInput: UpdateCertificateInput) {
    const updatedData = plainToInstance(
      UpdateCertificateInput,
      updateCertificateInput,
      { excludeExtraneousValues: true },
    );

    return this.certificateRepository.save({ id, ...updatedData });
  }

  async remove(id: number) {
    const certificate = await this.certificateRepository.findOne(id);
    if (!certificate) {
      throw new HttpException(`Certificate with the id: ${id} is not exist`, 422);
    }
    await this.certificateRepository.delete(id);
    return certificate;
  }
}
