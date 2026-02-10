import { t } from '@/i18n';
import * as yup from 'yup';

export const checkoutSchema = yup.object({
  paymentMethodType: yup
    .string()
    .oneOf(['credit_card', 'pix', 'boleto'] as const)
    .required(),
  cardholderName: yup
    .string()
    .when('paymentMethodType', ([type], schema) =>
      type === 'credit_card'
        ? schema.required(t('validation.cardholderRequired')).min(2, t('validation.cardholderMin'))
        : schema.optional()
    ),
  cardNumber: yup
    .string()
    .when('paymentMethodType', ([type], schema) =>
      type === 'credit_card'
        ? schema
            .required(t('validation.cardNumberRequired'))
            .test('valid-card-number', t('validation.cardNumberInvalid'), (value) => {
              if (!value) return false;
              const cleaned = value.replace(/\s/g, '');
              return /^\d{16}$/.test(cleaned);
            })
        : schema.optional()
    ),
  expiryDate: yup
    .string()
    .when('paymentMethodType', ([type], schema) =>
      type === 'credit_card'
        ? schema
            .required(t('validation.expiryRequired'))
            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, t('validation.expiryInvalid'))
        : schema.optional()
    ),
  cvv: yup
    .string()
    .when('paymentMethodType', ([type], schema) =>
      type === 'credit_card'
        ? schema
            .required(t('validation.cvvRequired'))
            .matches(/^\d{3,4}$/, t('validation.cvvInvalid'))
        : schema.optional()
    ),
});

export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;
