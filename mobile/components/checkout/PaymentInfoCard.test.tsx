import { render, screen } from '@testing-library/react-native';

import { PaymentInfoCard } from './PaymentInfoCard';

describe('PaymentInfoCard', () => {
  // ── Pix ──────────────────────────────────────────
  describe('pix variant', () => {
    it('renders section title', () => {
      render(<PaymentInfoCard type="pix" colorScheme="light" />);
      expect(screen.getByText('checkout.paymentDetails')).toBeTruthy();
    });

    it('renders pix title', () => {
      render(<PaymentInfoCard type="pix" colorScheme="light" />);
      expect(screen.getByText('checkout.pixTitle')).toBeTruthy();
    });

    it('renders pix description', () => {
      render(<PaymentInfoCard type="pix" colorScheme="light" />);
      expect(screen.getByText('checkout.pixDescription')).toBeTruthy();
    });

    it('does not render a notice for pix', () => {
      render(<PaymentInfoCard type="pix" colorScheme="light" />);
      expect(screen.queryByText('checkout.boletoNotice')).toBeNull();
    });
  });

  // ── Boleto ───────────────────────────────────────
  describe('boleto variant', () => {
    it('renders boleto title', () => {
      render(<PaymentInfoCard type="boleto" colorScheme="light" />);
      expect(screen.getByText('checkout.boletoTitle')).toBeTruthy();
    });

    it('renders boleto description', () => {
      render(<PaymentInfoCard type="boleto" colorScheme="light" />);
      expect(screen.getByText('checkout.boletoDescription')).toBeTruthy();
    });

    it('renders boleto notice', () => {
      render(<PaymentInfoCard type="boleto" colorScheme="light" />);
      expect(screen.getByText('checkout.boletoNotice')).toBeTruthy();
    });
  });

  // ── Color scheme ─────────────────────────────────
  describe('color scheme', () => {
    it('renders pix in dark mode without error', () => {
      const { toJSON } = render(<PaymentInfoCard type="pix" colorScheme="dark" />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders boleto in dark mode without error', () => {
      const { toJSON } = render(<PaymentInfoCard type="boleto" colorScheme="dark" />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
