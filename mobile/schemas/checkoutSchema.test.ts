import { checkoutSchema } from './checkoutSchema';

describe('checkoutSchema', () => {
  const validCardData = {
    paymentMethodType: 'credit_card',
    cardholderName: 'John Doe',
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12/25',
    cvv: '123',
  };

  // ── Credit Card Validation ───────────────────────
  it('accepts valid credit card data', async () => {
    await expect(checkoutSchema.isValid(validCardData)).resolves.toBe(true);
  });

  it('rejects empty cardholder name for credit card', async () => {
    await expect(
      checkoutSchema.validate({ ...validCardData, cardholderName: '' })
    ).rejects.toThrow();
  });

  it('rejects cardholder name shorter than 2 characters', async () => {
    await expect(
      checkoutSchema.validate({ ...validCardData, cardholderName: 'A' })
    ).rejects.toThrow();
  });

  it('accepts card number without spaces', async () => {
    await expect(
      checkoutSchema.isValid({ ...validCardData, cardNumber: '4111111111111111' })
    ).resolves.toBe(true);
  });

  it('rejects card number with wrong length', async () => {
    await expect(
      checkoutSchema.validate({ ...validCardData, cardNumber: '1234' })
    ).rejects.toThrow();
  });

  it('rejects empty card number', async () => {
    await expect(checkoutSchema.validate({ ...validCardData, cardNumber: '' })).rejects.toThrow();
  });

  it('rejects card number with letters', async () => {
    await expect(
      checkoutSchema.validate({ ...validCardData, cardNumber: 'abcd efgh ijkl mnop' })
    ).rejects.toThrow();
  });

  it('accepts valid expiry date MM/YY', async () => {
    await expect(checkoutSchema.isValid({ ...validCardData, expiryDate: '01/30' })).resolves.toBe(
      true
    );
  });

  it('rejects expiry with invalid month', async () => {
    await expect(
      checkoutSchema.validate({ ...validCardData, expiryDate: '13/25' })
    ).rejects.toThrow();
  });

  it('rejects expiry with wrong format', async () => {
    await expect(
      checkoutSchema.validate({ ...validCardData, expiryDate: '2025/12' })
    ).rejects.toThrow();
  });

  it('rejects empty expiry date', async () => {
    await expect(checkoutSchema.validate({ ...validCardData, expiryDate: '' })).rejects.toThrow();
  });

  it('accepts 3-digit CVV', async () => {
    await expect(checkoutSchema.isValid({ ...validCardData, cvv: '123' })).resolves.toBe(true);
  });

  it('accepts 4-digit CVV (Amex)', async () => {
    await expect(checkoutSchema.isValid({ ...validCardData, cvv: '1234' })).resolves.toBe(true);
  });

  it('rejects 2-digit CVV', async () => {
    await expect(checkoutSchema.validate({ ...validCardData, cvv: '12' })).rejects.toThrow();
  });

  it('rejects 5-digit CVV', async () => {
    await expect(checkoutSchema.validate({ ...validCardData, cvv: '12345' })).rejects.toThrow();
  });

  it('rejects empty CVV', async () => {
    await expect(checkoutSchema.validate({ ...validCardData, cvv: '' })).rejects.toThrow();
  });

  // ── Pix Validation ──────────────────────────────
  it('accepts pix without card fields', async () => {
    await expect(checkoutSchema.isValid({ paymentMethodType: 'pix' })).resolves.toBe(true);
  });

  it('accepts pix with empty card fields', async () => {
    await expect(
      checkoutSchema.isValid({
        paymentMethodType: 'pix',
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      })
    ).resolves.toBe(true);
  });

  // ── Boleto Validation ───────────────────────────
  it('accepts boleto without card fields', async () => {
    await expect(checkoutSchema.isValid({ paymentMethodType: 'boleto' })).resolves.toBe(true);
  });

  it('accepts boleto with empty card fields', async () => {
    await expect(
      checkoutSchema.isValid({
        paymentMethodType: 'boleto',
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      })
    ).resolves.toBe(true);
  });

  // ── Invalid payment method type ─────────────────
  it('rejects unknown payment method type', async () => {
    await expect(checkoutSchema.validate({ paymentMethodType: 'bitcoin' })).rejects.toThrow();
  });
});
