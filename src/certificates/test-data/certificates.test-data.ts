import { Certificate } from '../entities/certificate.entity';

export const CREATE_CERTIFICATE_DTO = {
  name: 'Certificate Name',
  code: 'CN',
  description: 'Some description about the certificate.',
};

export const UPDATE_CERTIFICATE_DTO = {
  name: 'Updated Name',
  code: 'Updated Code',
  description: 'Updated Description',
};

export const CERTIFICATES_DATA = [
  generateCertificate(1),
  generateCertificate(2),
  generateCertificate(3),
];

// Helpers
export function generateCertificate(
  id: number,
  overrides?: Partial<Certificate>,
) {
  return {
    id,
    name: `Certificate-${id}`,
    code: `C-${id}`,
    description: 'Some description about the certificate.',
    created_at: '2022-04-01T11:51:01.315Z',
    updated_at: '2022-04-01T11:51:01.315Z',
    ...overrides,
  };
}
