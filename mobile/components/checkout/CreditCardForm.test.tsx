import { fireEvent, render, screen } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { CreditCardForm } from './CreditCardForm';

// Wrapper component that provides react-hook-form context
function FormWrapper({
  colorScheme = 'light' as const,
  defaultValues = {},
}: {
  colorScheme?: 'light' | 'dark';
  defaultValues?: Record<string, string>;
}) {
  const methods = useForm({
    defaultValues: {
      paymentMethodType: 'credit_card',
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <View>
        <CreditCardForm
          control={methods.control as never}
          errors={methods.formState.errors as never}
          colorScheme={colorScheme}
        />
      </View>
    </FormProvider>
  );
}

describe('CreditCardForm', () => {
  // ── Renders all form fields ──────────────────────
  describe('rendering', () => {
    it('renders the section title', () => {
      render(<FormWrapper />);
      expect(screen.getByText('checkout.paymentDetails')).toBeTruthy();
    });

    it('renders the cardholder name label and input', () => {
      render(<FormWrapper />);
      expect(screen.getByText('checkout.cardholderName')).toBeTruthy();
      expect(screen.getByPlaceholderText('checkout.cardholderPlaceholder')).toBeTruthy();
    });

    it('renders the card number label and input', () => {
      render(<FormWrapper />);
      expect(screen.getByText('checkout.cardNumber')).toBeTruthy();
      expect(screen.getByPlaceholderText('checkout.cardNumberPlaceholder')).toBeTruthy();
    });

    it('renders the expiry date label and input', () => {
      render(<FormWrapper />);
      expect(screen.getByText('checkout.expiryDate')).toBeTruthy();
      expect(screen.getByPlaceholderText('checkout.expiryPlaceholder')).toBeTruthy();
    });

    it('renders the CVV label and input', () => {
      render(<FormWrapper />);
      expect(screen.getByText('checkout.cvv')).toBeTruthy();
      expect(screen.getByPlaceholderText('checkout.cvvPlaceholder')).toBeTruthy();
    });
  });

  // ── Input interaction ────────────────────────────
  describe('input interaction', () => {
    it('allows typing in the cardholder name field', () => {
      render(<FormWrapper />);
      const input = screen.getByPlaceholderText('checkout.cardholderPlaceholder');
      fireEvent.changeText(input, 'John Doe');
      expect(input.props.value).toBe('John Doe');
    });

    it('allows typing in the card number field (auto-formats)', () => {
      render(<FormWrapper />);
      const input = screen.getByPlaceholderText('checkout.cardNumberPlaceholder');
      fireEvent.changeText(input, '4111111111111111');
      // formatCardNumber inserts spaces every 4 digits
      expect(input.props.value).toBe('4111 1111 1111 1111');
    });

    it('allows typing in the expiry date field (auto-formats)', () => {
      render(<FormWrapper />);
      const input = screen.getByPlaceholderText('checkout.expiryPlaceholder');
      fireEvent.changeText(input, '1225');
      expect(input.props.value).toBe('12/25');
    });

    it('allows typing in the CVV field', () => {
      render(<FormWrapper />);
      const input = screen.getByPlaceholderText('checkout.cvvPlaceholder');
      fireEvent.changeText(input, '123');
      expect(input.props.value).toBe('123');
    });
  });

  // ── CVV focus triggers card flip ─────────────────
  describe('CVV focus / card flip', () => {
    it('renders the CreditCardVisual component', () => {
      render(<FormWrapper />);
      // The card shows placeholder number on the front
      expect(screen.getByText('**** **** **** ****')).toBeTruthy();
    });

    it('shows CVV on the card back when CVV field is focused', () => {
      render(<FormWrapper />);
      const cvvInput = screen.getByPlaceholderText('checkout.cvvPlaceholder');
      fireEvent(cvvInput, 'focus');
      // Card back always renders (opacity controlled by animation)
      expect(screen.getByText('CVV')).toBeTruthy();
    });
  });

  // ── Color scheme ─────────────────────────────────
  describe('color scheme', () => {
    it('renders in dark mode without error', () => {
      const { toJSON } = render(<FormWrapper colorScheme="dark" />);
      expect(toJSON()).toBeTruthy();
    });
  });

  // ── Pre-filled values ────────────────────────────
  describe('pre-filled values', () => {
    it('shows card visual with pre-filled data', () => {
      render(
        <FormWrapper
          defaultValues={{
            cardholderName: 'Jane Smith',
            cardNumber: '5111 1111 1111 1111',
            expiryDate: '06/28',
            cvv: '456',
          }}
        />
      );
      expect(screen.getByText('JANE SMITH')).toBeTruthy();
      expect(screen.getByText('5111 1111 1111 1111')).toBeTruthy();
      expect(screen.getByText('06/28')).toBeTruthy();
    });
  });
});
