import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CERTIFICATES_DATA,
  CREATE_CERTIFICATE_DTO,
  generateCertificate,
  UPDATE_CERTIFICATE_DTO,
} from './test-data/certificates.test-data';
import { certificatesRepositoryMock } from './test-data/certificates.test-mocks';
import { Certificate } from './entities/certificate.entity';
import { User } from '../users/entities/user.entity';
import { usersRepositoryMock } from '../users/test-data/users.test-mocks';

describe('CertificatesService', () => {
  let service: CertificatesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesService,
        {
          provide: getRepositoryToken(Certificate),
          useValue: certificatesRepositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CertificatesService>(CertificatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a certificate', async () => {
      expect(
        await service.create(CREATE_CERTIFICATE_DTO),
      ).toEqual({
        ...generateCertificate(CERTIFICATES_DATA.length + 1, CREATE_CERTIFICATE_DTO),
        id: expect.any(Number),
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of certificates', async () => {
      const certificates = await service.findAll();
      expect(certificates).toEqual(CERTIFICATES_DATA);
      expect(certificates.length).toBe(CERTIFICATES_DATA.length);
      expect(certificatesRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a certificate by id', async () => {
      expect(await service.findOne(CERTIFICATES_DATA[0].id)).toMatchObject(CERTIFICATES_DATA[0]);
      expect(certificatesRepositoryMock.findOneOrFail).toHaveBeenCalledWith(CERTIFICATES_DATA[0].id);
    });
  });

  describe('update', () => {
    it('should update a certificate', async () => {
      const dto = { id: CERTIFICATES_DATA[0].id, ...UPDATE_CERTIFICATE_DTO };
      const certificate = await service.update(CERTIFICATES_DATA[0].id, dto);
      expect(certificate).toEqual({ ...CERTIFICATES_DATA[0], ...UPDATE_CERTIFICATE_DTO });
      expect(certificatesRepositoryMock.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('should delete a certificate and return { deleted: true }', () => {
      expect(service.remove(CERTIFICATES_DATA[0].id)).resolves.toEqual({ ...CERTIFICATES_DATA[0] });
    });
  });
});
