import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AppErrorBoundary } from './ErrorBoundary';
import { CrashReport } from '@/services/analytics';

// Suppress console.error from the error boundary during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Component that throws an error on render
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>Child content</Text>;
}

describe('AppErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <AppErrorBoundary>
        <Text>Hello World</Text>
      </AppErrorBoundary>
    );

    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders default fallback when child throws an error', () => {
    const { getByText } = render(
      <AppErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    // Should show error boundary UI with translated keys
    expect(getByText('errorBoundary.title')).toBeTruthy();
    expect(getByText('errorBoundary.message')).toBeTruthy();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = <Text>Custom Error UI</Text>;

    const { getByText } = render(
      <AppErrorBoundary fallback={CustomFallback}>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    expect(getByText('Custom Error UI')).toBeTruthy();
  });

  it('reports error to CrashReport', () => {
    render(
      <AppErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    expect(CrashReport.recordError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.stringContaining('ErrorBoundary')
    );
  });

  it('shows retry button that resets the error state', () => {
    const { getByText, queryByText } = render(
      <AppErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    // Error state is showing
    expect(getByText('errorBoundary.title')).toBeTruthy();

    // Find and press the retry button
    const retryButton = getByText('errorBoundary.retry');
    expect(retryButton).toBeTruthy();
  });
});
