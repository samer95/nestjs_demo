import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Connection } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CREATE_USER_DTO,
  generateUser,
  UPDATE_USER_DTO,
  UPDATE_USER_PERMISSIONS_DTO,
  USERS_DATA,
} from './test-data/users.test-data';
import { UsersRepository } from './users.repository';
import { ConfigService } from '@nestjs/config';
import { CertificatesService } from '../certificates/certificates.service';
import {
  certificatesServiceMock,
  configServiceMock,
  connectionMock,
  usersRepositoryMock,
} from './test-data/users.test-mocks';
import { CERTIFICATES_DATA } from '../certificates/test-data/certificates.test-data';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersRepository),
          useValue: usersRepositoryMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: CertificatesService,
          useValue: certificatesServiceMock,
        },
        {
          provide: Connection,
          useValue: connectionMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      expect(
        await service.create({
          ...CREATE_USER_DTO,
          password_confirmation: CREATE_USER_DTO.password,
        }),
      ).toEqual({
        ...generateUser(USERS_DATA.length + 1, CREATE_USER_DTO),
        id: expect.any(Number),
        password: expect.any(String),
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(USERS_DATA);
      expect(users.length).toBe(USERS_DATA.length);
      expect(usersRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      expect(await service.findOne(USERS_DATA[0].id)).toMatchObject(
        USERS_DATA[0],
      );
      expect(usersRepositoryMock.findOneOrFail).toHaveBeenCalledWith(
        USERS_DATA[0].id,
      );
    });
  });

  describe('getCertificate', () => {
    it('should find a certificate by id', async () => {
      expect(
        await service.getCertificate(CERTIFICATES_DATA[0].id),
      ).toMatchObject(CERTIFICATES_DATA[0]);
      expect(certificatesServiceMock.findOne).toHaveBeenCalledWith(
        CERTIFICATES_DATA[0].id,
        false,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      expect(await service.findByEmail(USERS_DATA[0].email)).toMatchObject(
        USERS_DATA[0],
      );
      expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({
        email: USERS_DATA[0].email,
      });
    });
  });

  describe('findByOptions', () => {
    it('should find a user by options', async () => {
      const options = {
        first_name: 'UserFN-1',
        last_name: 'UserLN-1',
      };
      expect(await service.findByOptions(options)).toMatchObject([
        ...USERS_DATA,
      ]);
      expect(usersRepositoryMock.find).toHaveBeenCalledWith(options);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { id: USERS_DATA[0].id, ...UPDATE_USER_DTO };
      const user = await service.update(USERS_DATA[0].id, dto);
      expect(user).toEqual({ ...USERS_DATA[0], ...UPDATE_USER_DTO });
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('should delete a user and return { deleted: true }', () => {
      expect(service.remove(USERS_DATA[0].id)).resolves.toEqual({
        ...USERS_DATA[0],
      });
    });
  });

  describe('updatePermissions', () => {
    it('should update the permissions of a user', async () => {
      const res = await service.updatePermissions(UPDATE_USER_PERMISSIONS_DTO);
      expect(res).toEqual([...UPDATE_USER_PERMISSIONS_DTO.permissions]);
    });
  });
});
