import { t } from '@/i18n';
import * as yup from 'yup';

export const createRegisterSchema = () =>
  yup.object({
    name: yup.string().required(t('validation.nameRequired')).min(2, t('validation.nameMin')),
    email: yup.string().required(t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: yup
      .string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordMin')),
    confirmPassword: yup
      .string()
      .required(t('validation.confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('validation.passwordsMustMatch')),
  });

export type RegisterFormData = yup.InferType<ReturnType<typeof createRegisterSchema>>;
