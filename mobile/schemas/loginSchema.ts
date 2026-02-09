import * as yup from 'yup';
import { t } from '@/i18n';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(t('validation.emailRequired'))
    .email(t('validation.emailInvalid')),
  password: yup
    .string()
    .required(t('validation.passwordRequired'))
    .min(6, t('validation.passwordMin')),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
