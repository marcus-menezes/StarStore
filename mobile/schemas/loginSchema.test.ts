import { createLoginSchema } from './loginSchema';

describe('loginSchema', () => {
  const loginSchema = createLoginSchema();
  const validData = {
    email: 'user@example.com',
    password: '123456',
  };

  it('accepts valid data', async () => {
    await expect(loginSchema.isValid(validData)).resolves.toBe(true);
  });

  it('rejects empty email', async () => {
    await expect(loginSchema.validate({ ...validData, email: '' })).rejects.toThrow();
  });

  it('rejects invalid email', async () => {
    await expect(loginSchema.validate({ ...validData, email: 'not-an-email' })).rejects.toThrow();
  });

  it('rejects empty password', async () => {
    await expect(loginSchema.validate({ ...validData, password: '' })).rejects.toThrow();
  });

  it('rejects password shorter than 6 characters', async () => {
    await expect(loginSchema.validate({ ...validData, password: '12345' })).rejects.toThrow();
  });

  it('accepts password with exactly 6 characters', async () => {
    await expect(loginSchema.isValid({ ...validData, password: '123456' })).resolves.toBe(true);
  });
});
