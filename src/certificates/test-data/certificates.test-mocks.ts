import { Certificate } from '../entities/certificate.entity';
import { Repository } from 'typeorm';
import {
  CERTIFICATES_DATA,
  CREATE_CERTIFICATE_DTO,
  generateCertificate,
} from './certificates.test-data';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
export const certificatesRepositoryMock: MockType<Repository<Certificate>> = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(certificate => {
    Object.keys(certificate).forEach(
      key => certificate[key] === undefined && delete certificate[key],
    );
    return Promise.resolve(
      generateCertificate(certificate.id || CERTIFICATES_DATA.length + 1, {
        ...certificate,
      }),
    );
  }),
  findOne: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(CERTIFICATES_DATA[0])),
  find: jest
    .fn()
    .mockImplementation(options => Promise.resolve(CERTIFICATES_DATA)),
  findOneOrFail: jest
    .fn()
    .mockImplementation((id: number) => Promise.resolve(CERTIFICATES_DATA[0])),
  delete: jest.fn().mockResolvedValue(true),
};
export const configServiceMock: MockType<any> = {
  get: jest.fn().mockImplementation(key => {
    switch (key) {
      case 'settings.passSalt':
        return 10;
      default:
        return key;
    }
  }),
};
export const connectionMock: MockType<any> = {
  createQueryBuilder: jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  })),
};

export const certificatesServiceMock = {
  create: jest
    .fn()
    .mockResolvedValue(generateCertificate(50, CREATE_CERTIFICATE_DTO)),
  findAll: jest.fn().mockResolvedValue(CERTIFICATES_DATA),
  findOne: jest.fn((id: number) =>
    Promise.resolve({ ...CERTIFICATES_DATA[0], id }),
  ),
  getCertificate: jest.fn().mockResolvedValue(CERTIFICATES_DATA[0]),
  update: jest.fn((id: number, dto) =>
    Promise.resolve({ ...CERTIFICATES_DATA[0], ...dto, id }),
  ),
  remove: jest.fn((id: number) =>
    Promise.resolve({ ...CERTIFICATES_DATA[0], id }),
  ),
};
