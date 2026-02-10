import { t } from '@/i18n';
import * as yup from 'yup';

export const checkoutSchema = yup.object({
  cardholderName: yup
    .string()
    .required(t('validation.cardholderRequired'))
    .min(2, t('validation.cardholderMin')),
  cardNumber: yup
    .string()
    .required(t('validation.cardNumberRequired'))
    .test('valid-card-number', t('validation.cardNumberInvalid'), (value) => {
      if (!value) return false;
      const cleaned = value.replace(/\s/g, '');
      return /^\d{16}$/.test(cleaned);
    }),
  expiryDate: yup
    .string()
    .required(t('validation.expiryRequired'))
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, t('validation.expiryInvalid')),
  cvv: yup
    .string()
    .required(t('validation.cvvRequired'))
    .matches(/^\d{3,4}$/, t('validation.cvvInvalid')),
});

export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;
