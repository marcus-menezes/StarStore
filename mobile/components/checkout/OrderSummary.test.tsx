import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { OrderSummary } from './OrderSummary';

// Mock formatCurrency to return a predictable string
jest.mock('@/utils/formatCurrency', () => ({
  formatCurrency: (value: number) => `R$ ${value.toFixed(2)}`,
}));

describe('OrderSummary', () => {
  const defaultProps = {
    itemCount: 3,
    total: 249.99,
    colorScheme: 'light' as const,
  };

  it('renders the section title', () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText('checkout.orderSummary')).toBeTruthy();
  });

  it('displays the item count', () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText('checkout.items (3)')).toBeTruthy();
  });

  it('displays the total formatted as currency', () => {
    render(<OrderSummary {...defaultProps} />);
    // Total appears twice: once in items row, once in total row
    expect(screen.getAllByText('R$ 249.99').length).toBe(2);
  });

  it('displays free shipping', () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText('common.free')).toBeTruthy();
  });

  it('displays the shipping label', () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText('checkout.shipping')).toBeTruthy();
  });

  it('displays the total label', () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText('checkout.total')).toBeTruthy();
  });

  it('renders with zero items', () => {
    render(<OrderSummary itemCount={0} total={0} colorScheme="light" />);
    expect(screen.getByText('checkout.items (0)')).toBeTruthy();
    expect(screen.getAllByText('R$ 0.00').length).toBe(2);
  });

  it('renders in dark mode without error', () => {
    const { toJSON } = render(<OrderSummary {...defaultProps} colorScheme="dark" />);
    expect(toJSON()).toBeTruthy();
  });
});
