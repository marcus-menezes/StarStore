import { checkoutSchema } from './checkoutSchema';

describe('checkoutSchema', () => {
  const validData = {
    cardholderName: 'John Doe',
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12/25',
    cvv: '123',
  };

  it('accepts valid data', async () => {
    await expect(checkoutSchema.isValid(validData)).resolves.toBe(true);
  });

  it('rejects empty cardholder name', async () => {
    await expect(checkoutSchema.validate({ ...validData, cardholderName: '' })).rejects.toThrow();
  });

  it('rejects cardholder name shorter than 2 characters', async () => {
    await expect(checkoutSchema.validate({ ...validData, cardholderName: 'A' })).rejects.toThrow();
  });

  it('accepts card number without spaces', async () => {
    await expect(
      checkoutSchema.isValid({ ...validData, cardNumber: '4111111111111111' })
    ).resolves.toBe(true);
  });

  it('rejects card number with wrong length', async () => {
    await expect(checkoutSchema.validate({ ...validData, cardNumber: '1234' })).rejects.toThrow();
  });

  it('rejects empty card number', async () => {
    await expect(checkoutSchema.validate({ ...validData, cardNumber: '' })).rejects.toThrow();
  });

  it('rejects card number with letters', async () => {
    await expect(
      checkoutSchema.validate({ ...validData, cardNumber: 'abcd efgh ijkl mnop' })
    ).rejects.toThrow();
  });

  it('accepts valid expiry date MM/YY', async () => {
    await expect(checkoutSchema.isValid({ ...validData, expiryDate: '01/30' })).resolves.toBe(true);
  });

  it('rejects expiry with invalid month', async () => {
    await expect(checkoutSchema.validate({ ...validData, expiryDate: '13/25' })).rejects.toThrow();
  });

  it('rejects expiry with wrong format', async () => {
    await expect(
      checkoutSchema.validate({ ...validData, expiryDate: '2025/12' })
    ).rejects.toThrow();
  });

  it('rejects empty expiry date', async () => {
    await expect(checkoutSchema.validate({ ...validData, expiryDate: '' })).rejects.toThrow();
  });

  it('accepts 3-digit CVV', async () => {
    await expect(checkoutSchema.isValid({ ...validData, cvv: '123' })).resolves.toBe(true);
  });

  it('accepts 4-digit CVV (Amex)', async () => {
    await expect(checkoutSchema.isValid({ ...validData, cvv: '1234' })).resolves.toBe(true);
  });

  it('rejects 2-digit CVV', async () => {
    await expect(checkoutSchema.validate({ ...validData, cvv: '12' })).rejects.toThrow();
  });

  it('rejects 5-digit CVV', async () => {
    await expect(checkoutSchema.validate({ ...validData, cvv: '12345' })).rejects.toThrow();
  });

  it('rejects empty CVV', async () => {
    await expect(checkoutSchema.validate({ ...validData, cvv: '' })).rejects.toThrow();
  });
});
