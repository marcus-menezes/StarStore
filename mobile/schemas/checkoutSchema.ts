import * as yup from 'yup';

export const checkoutSchema = yup.object({
  cardholderName: yup
    .string()
    .required('Cardholder name is required')
    .min(2, 'Name must be at least 2 characters'),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .test(
      'valid-card-number',
      'Invalid card number (16 digits required)',
      (value) => {
        if (!value) return false;
        const cleaned = value.replace(/\s/g, '');
        return /^\d{16}$/.test(cleaned);
      },
    ),
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .matches(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      'Invalid expiry date (MM/YY)',
    ),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'Invalid CVV (3-4 digits)'),
});

export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;
