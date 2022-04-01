import { Test, TestingModule } from '@nestjs/testing';
import { CertificatesService } from './certificates.service';
import { CertificatesResolver } from './certificates.resolver';
import {
  CERTIFICATES_DATA,
  CREATE_CERTIFICATE_DTO,
  generateCertificate,
  UPDATE_CERTIFICATE_DTO,
} from './test-data/certificates.test-data';
import { certificatesServiceMock } from './test-data/certificates.test-mocks';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { usersRepositoryMock } from '../users/test-data/users.test-mocks';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

describe('CertificatesResolver', () => {
  let resolver: CertificatesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificatesResolver,
        {
          provide: CertificatesService,
          useValue: certificatesServiceMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
        {
          provide: CaslAbilityFactory,
          useValue: {
            createForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<CertificatesResolver>(CertificatesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCertificate', () => {
    it('should create a new certificate', async () => {
      expect(
        await resolver.createCertificate(CREATE_CERTIFICATE_DTO),
      ).toEqual({
        ...generateCertificate(CERTIFICATES_DATA.length + 1, CREATE_CERTIFICATE_DTO),
        id: expect.any(Number),
      });

      expect(certificatesServiceMock.create).toHaveBeenCalledWith(CREATE_CERTIFICATE_DTO);
    });
  });

  describe('findAll', () => {
    it('should get the certificates array', async () => {
      expect(await resolver.findAll()).toEqual(CERTIFICATES_DATA);

      expect(certificatesServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get one certificate', async () => {
      expect(
        await resolver.findOne(CERTIFICATES_DATA[0].id),
      ).toEqual(
        { ...CERTIFICATES_DATA[0] },
      );

      expect(certificatesServiceMock.findOne).toHaveBeenCalledWith(CERTIFICATES_DATA[0].id);
    });
  });

  describe('updateCertificate', () => {
    it('should update a certificate', async () => {
      const updatedData = { ...UPDATE_CERTIFICATE_DTO, id: CERTIFICATES_DATA[0].id };
      expect(
        await resolver.updateCertificate(updatedData),
      ).toEqual({
        ...CERTIFICATES_DATA[0],
        ...updatedData,
      });

      expect(certificatesServiceMock.update).toHaveBeenCalledWith(1, updatedData);
    });
  });

  describe('removeCertificate', () => {
    it('should remove a certificate', async () => {
      expect(
        await resolver.removeCertificate(CERTIFICATES_DATA[0].id),
      ).toEqual(
        { ...CERTIFICATES_DATA[0] },
      );

      expect(certificatesServiceMock.remove).toHaveBeenCalledWith(CERTIFICATES_DATA[0].id);
    });
  });
});
