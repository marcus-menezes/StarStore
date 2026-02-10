import { createRegisterSchema } from './registerSchema';

describe('registerSchema', () => {
  const registerSchema = createRegisterSchema();
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    confirmPassword: '123456',
  };

  it('accepts valid data', async () => {
    await expect(registerSchema.isValid(validData)).resolves.toBe(true);
  });

  it('rejects empty name', async () => {
    await expect(registerSchema.validate({ ...validData, name: '' })).rejects.toThrow();
  });

  it('rejects name shorter than 2 characters', async () => {
    await expect(registerSchema.validate({ ...validData, name: 'A' })).rejects.toThrow();
  });

  it('rejects empty email', async () => {
    await expect(registerSchema.validate({ ...validData, email: '' })).rejects.toThrow();
  });

  it('rejects invalid email format', async () => {
    await expect(registerSchema.validate({ ...validData, email: 'invalid' })).rejects.toThrow();
  });

  it('rejects empty password', async () => {
    await expect(
      registerSchema.validate({ ...validData, password: '', confirmPassword: '' })
    ).rejects.toThrow();
  });

  it('rejects password shorter than 6 characters', async () => {
    await expect(
      registerSchema.validate({ ...validData, password: '12345', confirmPassword: '12345' })
    ).rejects.toThrow();
  });

  it('rejects when confirmPassword does not match password', async () => {
    await expect(
      registerSchema.validate({ ...validData, confirmPassword: 'different' })
    ).rejects.toThrow();
  });

  it('accepts when confirmPassword matches password', async () => {
    await expect(registerSchema.isValid(validData)).resolves.toBe(true);
  });
});
