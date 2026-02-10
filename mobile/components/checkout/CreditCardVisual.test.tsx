import { render, screen } from '@testing-library/react-native';

import { CreditCardVisual } from './CreditCardVisual';

const defaultProps = {
  cardNumber: '',
  cardholderName: '',
  expiryDate: '',
  cvv: '',
  isCvvFocused: false,
  colorScheme: 'light' as const,
};

describe('CreditCardVisual', () => {
  // ── Front face rendering ─────────────────────────
  describe('front face', () => {
    it('shows placeholder card number when empty', () => {
      render(<CreditCardVisual {...defaultProps} />);
      expect(screen.getByText('**** **** **** ****')).toBeTruthy();
    });

    it('shows formatted card number with remaining digits masked', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="4111 1111" />);
      expect(screen.getByText('4111 1111 **** ****')).toBeTruthy();
    });

    it('shows full card number when all 16 digits are entered', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="4111 1111 1111 1111" />);
      expect(screen.getByText('4111 1111 1111 1111')).toBeTruthy();
    });

    it('shows placeholder name when cardholderName is empty', () => {
      render(<CreditCardVisual {...defaultProps} />);
      expect(screen.getByText('SEU NOME AQUI')).toBeTruthy();
    });

    it('shows cardholder name in uppercase', () => {
      render(<CreditCardVisual {...defaultProps} cardholderName="John Doe" />);
      expect(screen.getByText('JOHN DOE')).toBeTruthy();
    });

    it('shows placeholder expiry when empty', () => {
      render(<CreditCardVisual {...defaultProps} />);
      expect(screen.getByText('MM/AA')).toBeTruthy();
    });

    it('shows expiry date when provided', () => {
      render(<CreditCardVisual {...defaultProps} expiryDate="12/25" />);
      expect(screen.getByText('12/25')).toBeTruthy();
    });

    it('shows default brand text when card number is empty', () => {
      render(<CreditCardVisual {...defaultProps} />);
      // Both front and back show brand text
      expect(screen.getAllByText('CARTÃO').length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Card brand detection ─────────────────────────
  describe('card brand detection', () => {
    it('detects VISA', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="4111 1111 1111 1111" />);
      expect(screen.getAllByText('VISA').length).toBeGreaterThanOrEqual(1);
    });

    it('detects MASTERCARD', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="5111 1111 1111 1111" />);
      expect(screen.getAllByText('MASTERCARD').length).toBeGreaterThanOrEqual(1);
    });

    it('detects AMEX', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="3411 1111 1111 111" />);
      expect(screen.getAllByText('AMEX').length).toBeGreaterThanOrEqual(1);
    });

    it('detects ELO', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="5067 1111 1111 1111" />);
      expect(screen.getAllByText('ELO').length).toBeGreaterThanOrEqual(1);
    });

    it('detects HIPERCARD', () => {
      render(<CreditCardVisual {...defaultProps} cardNumber="6062 8211 1111 1111" />);
      expect(screen.getAllByText('HIPERCARD').length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Back face rendering ──────────────────────────
  describe('back face', () => {
    it('shows placeholder CVV when empty', () => {
      render(<CreditCardVisual {...defaultProps} isCvvFocused />);
      expect(screen.getByText('***')).toBeTruthy();
    });

    it('shows CVV value when provided', () => {
      render(<CreditCardVisual {...defaultProps} cvv="123" isCvvFocused />);
      expect(screen.getByText('123')).toBeTruthy();
    });

    it('shows CVV label', () => {
      render(<CreditCardVisual {...defaultProps} isCvvFocused />);
      expect(screen.getByText('CVV')).toBeTruthy();
    });
  });

  // ── Color scheme ─────────────────────────────────
  describe('color scheme', () => {
    it('renders in light mode without error', () => {
      const { toJSON } = render(<CreditCardVisual {...defaultProps} colorScheme="light" />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders in dark mode without error', () => {
      const { toJSON } = render(<CreditCardVisual {...defaultProps} colorScheme="dark" />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
