import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  logScreenView as firebaseLogScreenView,
  setUserId as analyticsSetUserId,
  setUserProperty as analyticsSetUserProperty,
} from '@react-native-firebase/analytics';
import {
  getCrashlytics,
  log as crashLog,
  recordError as crashRecordError,
  setUserId as crashSetUserId,
  setAttributes as crashSetAttributes,
} from '@react-native-firebase/crashlytics';

// ─── Analytics ──────────────────────────────────────────────
// Centralized wrapper around Firebase Analytics.
// All screen/event logging should go through this object so the
// rest of the codebase never imports the Firebase SDK directly.

const analyticsInstance = getAnalytics();

export const Analytics = {
  /** Log a screen view event */
  async logScreenView(screenName: string, screenClass?: string) {
    try {
      await firebaseLogScreenView(analyticsInstance, {
        screen_name: screenName,
        screen_class: screenClass ?? screenName,
      });
    } catch (error) {
      console.warn('[Analytics] logScreenView failed:', error);
    }
  },

  /** Log a successful login */
  async logLogin(method = 'email') {
    try {
      await firebaseLogEvent(analyticsInstance, 'login', { method });
    } catch (error) {
      console.warn('[Analytics] logLogin failed:', error);
    }
  },

  /** Log a successful sign-up */
  async logSignUp(method = 'email') {
    try {
      await firebaseLogEvent(analyticsInstance, 'sign_up', { method });
    } catch (error) {
      console.warn('[Analytics] logSignUp failed:', error);
    }
  },

  /** Log when a user views a product */
  async logViewItem(productId: string, productName: string, price: number, category?: string) {
    try {
      await firebaseLogEvent(analyticsInstance, 'view_item', {
        currency: 'BRL',
        value: price,
        items: [
          {
            item_id: productId,
            item_name: productName,
            item_category: category ?? '',
            price,
          },
        ],
      });
    } catch (error) {
      console.warn('[Analytics] logViewItem failed:', error);
    }
  },

  /** Log when a product is added to the cart */
  async logAddToCart(productId: string, productName: string, price: number) {
    try {
      await firebaseLogEvent(analyticsInstance, 'add_to_cart', {
        currency: 'BRL',
        value: price,
        items: [
          {
            item_id: productId,
            item_name: productName,
            price,
            quantity: 1,
          },
        ],
      });
    } catch (error) {
      console.warn('[Analytics] logAddToCart failed:', error);
    }
  },

  /** Log when a product is removed from the cart */
  async logRemoveFromCart(productId: string, productName: string) {
    try {
      await firebaseLogEvent(analyticsInstance, 'remove_from_cart', {
        items: [
          {
            item_id: productId,
            item_name: productName,
          },
        ],
      });
    } catch (error) {
      console.warn('[Analytics] logRemoveFromCart failed:', error);
    }
  },

  /** Log when the user starts the checkout flow */
  async logBeginCheckout(total: number, itemCount: number) {
    try {
      await firebaseLogEvent(analyticsInstance, 'begin_checkout', {
        value: total,
        currency: 'BRL',
        items_count: itemCount,
      });
    } catch (error) {
      console.warn('[Analytics] logBeginCheckout failed:', error);
    }
  },

  /** Log a successful purchase */
  async logPurchase(orderId: string, total: number, itemCount: number) {
    try {
      await firebaseLogEvent(analyticsInstance, 'purchase', {
        transaction_id: orderId,
        value: total,
        currency: 'BRL',
        items_count: itemCount,
      });
    } catch (error) {
      console.warn('[Analytics] logPurchase failed:', error);
    }
  },

  /** Log a generic custom event */
  async logEvent(name: string, params?: Record<string, unknown>) {
    try {
      await firebaseLogEvent(analyticsInstance, name, params);
    } catch (error) {
      console.warn('[Analytics] logEvent failed:', error);
    }
  },

  /** Set the current user ID for analytics */
  async setUserId(userId: string | null) {
    try {
      await analyticsSetUserId(analyticsInstance, userId);
    } catch (error) {
      console.warn('[Analytics] setUserId failed:', error);
    }
  },

  /** Set a user property */
  async setUserProperty(name: string, value: string) {
    try {
      await analyticsSetUserProperty(analyticsInstance, name, value);
    } catch (error) {
      console.warn('[Analytics] setUserProperty failed:', error);
    }
  },
};

// ─── Crashlytics ────────────────────────────────────────────
// Centralized wrapper around Firebase Crashlytics.
// All error reporting should go through this object.

const crashInstance = getCrashlytics();

export const CrashReport = {
  /** Set the user identifier for crash reports */
  setUserId(userId: string) {
    try {
      crashSetUserId(crashInstance, userId);
    } catch (error) {
      console.warn('[CrashReport] setUserId failed:', error);
    }
  },

  /** Add a log message that will appear in the Crashlytics timeline */
  log(message: string) {
    try {
      crashLog(crashInstance, message);
    } catch (error) {
      console.warn('[CrashReport] log failed:', error);
    }
  },

  /**
   * Record a non-fatal error with optional context.
   * The context string is logged before recording so it appears
   * in the Crashlytics timeline alongside the error.
   */
  recordError(error: Error, context?: string) {
    try {
      if (context) {
        crashLog(crashInstance, context);
      }
      crashRecordError(crashInstance, error);
    } catch (e) {
      console.warn('[CrashReport] recordError failed:', e);
    }
  },

  /** Set custom key/value attributes for crash reports */
  async setAttributes(attrs: Record<string, string>) {
    try {
      await crashSetAttributes(crashInstance, attrs);
    } catch (error) {
      console.warn('[CrashReport] setAttributes failed:', error);
    }
  },
};
