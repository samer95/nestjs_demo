import { HttpException, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Certificate } from '../certificates/entities/certificate.entity';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private certificateService: CertificatesService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async create(createUserInput: CreateUserInput): Promise<User> {
    const userData = plainToInstance(CreateUserInput, createUserInput, { excludeExtraneousValues: true });
    userData.password = await bcrypt.hash(createUserInput.password, this.configService.get('settings.passSalt'));

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  getCertificate(id: number): Promise<Certificate> {
    console.log('getCertificate', id);
    return this.certificateService.findOne(id, false);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  findByOptions(options = {}): Promise<User[]> {
    return this.userRepository.find(options);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    const updatedData = plainToInstance(UpdateUserInput, updateUserInput, { excludeExtraneousValues: true });

    const optionalAttrs = ['user_type', 'gender', 'max_facilities_count', 'lang'];
    optionalAttrs.forEach((attr) => !updatedData[attr] && delete updatedData[attr]);

    return this.userRepository.save({ id, ...updatedData });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException(`User with the id: ${id} is not exist`, 422);
    }
    await this.userRepository.delete(id);
    return user;
  }
}
