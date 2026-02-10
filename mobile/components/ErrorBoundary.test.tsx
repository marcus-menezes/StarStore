import { CrashReport } from '@/services/analytics';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppErrorBoundary } from './ErrorBoundary';

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

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

    expect(getByText('errorBoundary.title')).toBeTruthy();

    const retryButton = getByText('errorBoundary.retry');
    expect(retryButton).toBeTruthy();
  });
});
