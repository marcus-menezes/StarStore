import { t } from '@/i18n';
import * as yup from 'yup';

export const createForgotPasswordSchema = () =>
  yup.object({
    email: yup.string().required(t('validation.emailRequired')).email(t('validation.emailInvalid')),
  });

export type ForgotPasswordFormData = yup.InferType<ReturnType<typeof createForgotPasswordSchema>>;
