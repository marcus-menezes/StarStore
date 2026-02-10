import { t } from '@/i18n';
import * as yup from 'yup';

export const createLoginSchema = () =>
  yup.object({
    email: yup.string().required(t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: yup
      .string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordMin')),
  });

export type LoginFormData = yup.InferType<ReturnType<typeof createLoginSchema>>;
