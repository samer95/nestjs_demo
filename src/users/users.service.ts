import {
  HttpException,
  Injectable,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { Certificate } from '../certificates/entities/certificate.entity';
import { CertificatesService } from '../certificates/certificates.service';
import { UpdateUserPermissionsInput } from './dto/update-user-permissions.input';
import { UsersRepository } from './users.repository';
import { Connection } from 'typeorm';
import { UserPermission } from '../user-permissions/entities/user-permission.entity';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private configService: ConfigService,
    private certificateService: CertificatesService,
    private connection: Connection,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async create(createUserInput: CreateUserInput): Promise<User> {
    const userData = plainToInstance(CreateUserInput, createUserInput, {
      excludeExtraneousValues: true,
    });
    userData.password = await bcrypt.hash(
      createUserInput.password,
      this.configService.get('settings.passSalt'),
    );

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
    return this.certificateService.findOne(id, false);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  findByOptions(options = {}): Promise<User[]> {
    return this.userRepository.find(options);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    const updatedData = plainToInstance(UpdateUserInput, updateUserInput, {
      excludeExtraneousValues: true,
    });

    const optionalAttrs = [
      'user_type',
      'gender',
      'max_facilities_count',
      'lang',
    ];
    optionalAttrs.forEach(
      attr => !updatedData[attr] && delete updatedData[attr],
    );

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

  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePermissions(
    data: UpdateUserPermissionsInput,
  ): Promise<UserPermission[]> {
    // Remove old permissions
    await this.connection
      .createQueryBuilder()
      .delete()
      .from(UserPermission)
      .where('user_id = :user_id', { user_id: data.id })
      .execute();

    const userPermissions = data.permissions.map(permData => {
      const newObj = new UserPermission();
      newObj.user_id = data.id;
      newObj.object = permData.object;
      newObj.action = permData.action;
      return newObj;
    });

    return await this.connection.transaction(
      async manager => await manager.save(userPermissions),
    );
  }
}
