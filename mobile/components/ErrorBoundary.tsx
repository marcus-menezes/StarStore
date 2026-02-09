import { Component, type ReactNode } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { t } from '@/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  // Use dark theme colors as safe default since we can't use hooks in class components
  const colors = Colors.dark;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FontAwesome name="exclamation-triangle" size={64} color={colors.error} />
      <Text style={[styles.title, { color: colors.text }]}>
        {t('errorBoundary.title')}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {t('errorBoundary.message')}
      </Text>
      {__DEV__ && error && (
        <View style={[styles.errorDetails, { backgroundColor: colors.surface }]}>
          <Text style={[styles.errorText, { color: colors.error }]} numberOfLines={5}>
            {error.message}
          </Text>
        </View>
      )}
      <Pressable
        style={[styles.retryButton, { backgroundColor: colors.buttonBackground }]}
        onPress={onRetry}>
        <FontAwesome name="refresh" size={16} color={colors.buttonText} />
        <Text style={[styles.retryButtonText, { color: colors.buttonText }]}>
          {t('errorBoundary.retry')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorDetails: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  retryButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
