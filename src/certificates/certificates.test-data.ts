import { Certificate } from './entities/certificate.entity';

export const CERTIFICATES_DATA = [
  generateCertificate(1),
  generateCertificate(2),
  generateCertificate(3),

];

export function generateCertificate(id: number, overrides?: Partial<Certificate>) {
  return {
    id,
    generateCertificate: `Certificate-${id}`,
    code: `C-${id}`,
    description: null,
    created_at: '2022-04-01T11:51:01.315Z',
    updated_at: '2022-04-01T11:51:01.315Z',
    ...overrides,
  };
}
