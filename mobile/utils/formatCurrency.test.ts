import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats integer values', () => {
    const result = formatCurrency(100);
    expect(result).toMatch(/R\$\s?100,00/);
  });

  it('formats values with cents', () => {
    const result = formatCurrency(29.99);
    expect(result).toMatch(/R\$\s?29,99/);
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/R\$\s?0,00/);
  });

  it('formats negative values', () => {
    const result = formatCurrency(-50);
    expect(result).toContain('50,00');
  });

  it('formats large values with thousands separator', () => {
    const result = formatCurrency(1234.56);
    expect(result).toMatch(/R\$/);
    expect(result).toContain('1.234,56');
  });
});
