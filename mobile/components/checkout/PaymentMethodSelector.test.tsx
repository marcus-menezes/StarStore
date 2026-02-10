import { fireEvent, render, screen } from '@testing-library/react-native';

import { PaymentMethodSelector } from './PaymentMethodSelector';

describe('PaymentMethodSelector', () => {
  const mockOnSelect = jest.fn();

  const defaultProps = {
    selectedMethod: 'credit_card' as const,
    onSelect: mockOnSelect,
    colorScheme: 'light' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the section title', () => {
    render(<PaymentMethodSelector {...defaultProps} />);
    expect(screen.getByText('checkout.paymentMethod')).toBeTruthy();
  });

  it('renders all three payment method options', () => {
    render(<PaymentMethodSelector {...defaultProps} />);
    expect(screen.getByText('checkout.creditCard')).toBeTruthy();
    expect(screen.getByText('checkout.pix')).toBeTruthy();
    expect(screen.getByText('checkout.boleto')).toBeTruthy();
  });

  it('calls onSelect with credit_card when card option is pressed', () => {
    render(<PaymentMethodSelector {...defaultProps} selectedMethod="pix" />);
    fireEvent.press(screen.getByText('checkout.creditCard'));
    expect(mockOnSelect).toHaveBeenCalledWith('credit_card');
  });

  it('calls onSelect with pix when pix option is pressed', () => {
    render(<PaymentMethodSelector {...defaultProps} />);
    fireEvent.press(screen.getByText('checkout.pix'));
    expect(mockOnSelect).toHaveBeenCalledWith('pix');
  });

  it('calls onSelect with boleto when boleto option is pressed', () => {
    render(<PaymentMethodSelector {...defaultProps} />);
    fireEvent.press(screen.getByText('checkout.boleto'));
    expect(mockOnSelect).toHaveBeenCalledWith('boleto');
  });

  it('renders in dark mode without error', () => {
    const { toJSON } = render(<PaymentMethodSelector {...defaultProps} colorScheme="dark" />);
    expect(toJSON()).toBeTruthy();
  });
});
