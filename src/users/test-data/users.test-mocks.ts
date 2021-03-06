import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import {
  CREATE_USER_DTO,
  generateUser,
  UPDATE_USER_PERMISSIONS_DTO,
  USER_PERMISSIONS,
  USERS_DATA,
} from './users.test-data';
import { CERTIFICATES_DATA } from '../../certificates/test-data/certificates.test-data';
import { MockType } from '../../common/types/mock.type';

export const usersRepositoryMock: MockType<Repository<User>> = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(user => {
    Object.keys(user).forEach(
      key => user[key] === undefined && delete user[key],
    );
    return Promise.resolve(
      generateUser(user.id || USERS_DATA.length + 1, { ...user }),
    );
  }),
  findOne: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(USERS_DATA[0])),
  find: jest.fn().mockImplementation(options => Promise.resolve(USERS_DATA)),
  findOneOrFail: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(USERS_DATA[0])),
  delete: jest.fn().mockResolvedValue(true),
};

export const configServiceMock: MockType<any> = {
  get: jest.fn().mockImplementation(key => {
    switch (key) {
      case 'settings.passSalt':
        return 10;
      case 'settings.infura.projectId':
        return 'PROJECT_ID';
      case 'settings.redis.ttl':
        return 86400;
      default:
        return key;
    }
  }),
};

export const certificatesServiceMock: MockType<any> = {
  findOne: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(CERTIFICATES_DATA[0])),
};

export const connectionMock: MockType<any> = {
  createQueryBuilder: jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  })),
  transaction: jest
    .fn()
    .mockResolvedValue(UPDATE_USER_PERMISSIONS_DTO.permissions),
};

export const usersServiceMock = {
  create: jest.fn().mockResolvedValue(generateUser(50, CREATE_USER_DTO)),
  findAll: jest.fn().mockResolvedValue(USERS_DATA),
  findOne: jest.fn((id: number) => Promise.resolve({ ...USERS_DATA[0], id })),
  getCertificate: jest.fn().mockResolvedValue(CERTIFICATES_DATA[0]),
  update: jest.fn((id: number, dto) =>
    Promise.resolve({ ...USERS_DATA[0], ...dto, id }),
  ),
  updatePermissions: jest.fn(data => USER_PERMISSIONS),
  remove: jest.fn((id: number) => Promise.resolve({ ...USERS_DATA[0], id })),
};
