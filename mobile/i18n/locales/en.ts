export default {
  // Common
  common: {
    error: 'Error',
    back: 'Back',
    cancel: 'Cancel',
    ok: 'OK',
    total: 'Total',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    loading: 'Loading...',
    free: 'Free',
    recoverPassword: 'Recover Password',
  },

  // Tab names
  tabs: {
    home: 'Home',
    cart: 'Cart',
    orders: 'Orders',
    profile: 'Profile',
  },

  // Navigation headers
  nav: {
    productDetails: 'Product Details',
    orderDetails: 'Order Details',
    editProfile: 'Edit Profile',
    help: 'Help & Support',
    checkout: 'Checkout',
  },

  // Login screen
  login: {
    title: 'StarStore',
    subtitle: 'Sign in to your account',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    signInButton: 'Sign In',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account? ",
    signUpLink: 'Sign Up',
    errorInvalidCredentials: 'Invalid email or password',
  },

  // Forgot password screen
  forgotPassword: {
    title: 'Recover Password',
    subtitle: 'Enter your email and we will send you a link to reset your password',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your registered email',
    sendButton: 'Send Recovery Link',
    successMessage: 'Recovery email sent! Check your inbox.',
    errorMessage: 'Failed to send email. Check the address and try again.',
    backToLogin: 'Back to Login',
  },

  // Register screen
  register: {
    title: 'Join StarStore',
    subtitle: 'Create your account to start shopping',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Create a password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    signUpButton: 'Create Account',
    hasAccount: 'Already have an account? ',
    signInLink: 'Sign In',
    errorCreateAccount: 'Failed to create account. Please try again.',
  },

  // Home screen
  home: {
    title: 'StarStore',
    subtitle: 'The best merchandise in the galaxy',
    searchPlaceholder: 'Search products...',
    allCategories: 'All',
    sortByRelevance: 'Relevance',
    sortByPriceLow: 'Lowest price',
    sortByPriceHigh: 'Highest price',
    sortByName: 'A-Z',
    resultsCount: '{count} products',
    resultsCountSingle: '1 product',
    noResults: 'No products found',
    noResultsSubtitle: 'Try searching with different terms',
    errorLoadProducts: 'Failed to load products',
    addToCart: 'Add',
    addedToCart: 'Added!',
    inStock: 'In stock',
    lowStock: 'Low stock',
    outOfStock: 'Out of stock',
  },

  // Cart screen
  cart: {
    title: 'Shopping Cart',
    emptyTitle: 'Your cart is empty',
    emptySubtitle: 'Add some items to get started',
    startShopping: 'Start Shopping',
    clearAll: 'Clear All',
    clearCart: 'Clear Cart',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
  },

  // Checkout screen
  checkout: {
    orderSummary: 'Order Summary',
    items: 'Items',
    shipping: 'Shipping',
    total: 'Total',
    paymentMethod: 'Payment Method',
    paymentDetails: 'Payment Details',
    creditCard: 'Card',
    pix: 'Pix',
    boleto: 'Boleto',
    cardholderName: 'Cardholder Name',
    cardholderPlaceholder: 'Name on card',
    cardNumber: 'Card Number',
    cardNumberPlaceholder: '1234 5678 9012 3456',
    expiryDate: 'Expiry Date',
    expiryPlaceholder: 'MM/YY',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    pixTitle: 'Pay with Pix',
    pixDescription:
      'A QR Code will be generated after order confirmation. Payment must be completed within 30 minutes.',
    pixKey: 'Pix Key',
    boletoTitle: 'Pay with Boleto',
    boletoDescription:
      'The boleto will be generated after order confirmation. Payment deadline is up to 3 business days.',
    boletoNotice: 'The order will be confirmed after boleto payment is processed.',
    placeOrder: 'Place Order',
    signInRequired: 'Sign In Required',
    signInRequiredMessage: 'Sign in to your account to complete the purchase',
    emptyCart: 'Empty Cart',
    emptyCartMessage: 'Your cart is empty',
    orderPlaced: 'Order Placed!',
    orderPlacedMessage: 'Thank you for your purchase. Your order has been placed successfully.',
    errorPlaceOrder: 'Failed to place order. Please try again.',
  },

  // History screen
  history: {
    title: 'Order History',
    signInTitle: 'Sign in to view your orders',
    signInSubtitle: 'Your order history will appear here',
    signInAction: 'Sign In',
    errorTitle: 'Failed to load orders',
    errorSubtitle: 'Check your connection and try again',
    emptyTitle: 'No orders yet',
    emptySubtitle: 'Your purchase history will appear here',
    orderPrefix: 'Order',
    moreItems: 'more items',
    viewDetails: 'View details',
  },

  // Order detail screen
  orderDetail: {
    notFound: 'Order not found',
    orderNumber: 'Order #',
    placedOn: 'Placed on',
    updatedOn: 'Updated on',
    statusTitle: 'Tracking',
    status_pending: 'Pending',
    status_processing: 'Processing',
    status_shipped: 'Shipped',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',
    statusCancelled: 'This order has been cancelled',
    items: 'Items',
    qty: 'Qty',
    payment: 'Payment',
    paymentCreditCard: 'Credit Card',
    paymentPix: 'Pix',
    paymentPixDescription: 'Instant payment',
    paymentBoleto: 'Bank Slip',
    paymentBoletoDescription: 'Processing in up to 3 business days',
    summary: 'Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
  },

  // Profile screen
  profile: {
    guestTitle: 'Welcome to StarStore',
    guestSubtitle: 'Sign in to access your account and track orders',
    signInButton: 'Sign In',
    createAccountButton: 'Create Account',
    defaultUserName: 'User',
    editProfile: 'Edit Profile',
    helpSupport: 'Help & Support',
    signingOut: 'Signing out...',
    signOut: 'Sign Out',
  },

  // Settings in drawer
  settings: {
    title: 'Settings',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    language: 'Language',
    languagePt: 'Português',
    languageEn: 'English',
  },

  // Edit profile screen
  editProfile: {
    nameLabel: 'Name',
    namePlaceholder: 'Your full name',
    nameMin: 'Name must be at least 2 characters',
    emailLabel: 'Email',
    emailHint: 'Email cannot be changed',
    memberSince: 'Member since',
    save: 'Save Changes',
    successTitle: 'Profile Updated',
    successMessage: 'Your information has been saved successfully.',
    errorMessage: 'Could not save. Please try again.',
  },

  // Product detail screen
  product: {
    notFound: 'Product not found',
    goBack: 'Go Back',
    soldBy: 'Sold by',
    description: 'Description',
    category: 'Category',
    addToCart: 'Add to Cart',
    share: 'Share',
    shareMessage: 'Check out this product on StarStore: {name}',
  },

  // Help & Support screen
  help: {
    title: 'How can we help?',
    subtitle: 'Find answers or get in touch with us',
    faqTitle: 'Frequently Asked Questions',
    faq: {
      q1: 'How do I track my order?',
      a1: 'Go to the "Orders" tab in the bottom menu of the app. There you can find all your orders and see the updated status of each one by tapping on the desired order.',
      q2: 'What is the delivery time?',
      a2: 'Delivery time varies according to your region. On average, deliveries are made between 5 to 15 business days after payment confirmation.',
      q3: 'How do I exchange or return a product?',
      a3: 'You have up to 7 days after receiving the product to request an exchange or return. Contact us via WhatsApp or email with your order number.',
      q4: 'What payment methods are accepted?',
      a4: 'We accept credit cards from Visa, Mastercard, Elo, Amex, and Hipercard. We will also have Pix and boleto options soon.',
      q5: 'Are the products authentic?',
      a5: 'Yes! All products sold at StarStore are authentic and officially licensed. We only work with suppliers authorized by Lucasfilm.',
    },
    contactTitle: 'Contact Us',
    contact: {
      email: 'Email',
      emailValue: 'support@starstore.com.br',
      whatsapp: 'WhatsApp',
      whatsappValue: '(11) 99999-9999',
      hours: 'Business Hours',
      hoursValue: 'Mon to Fri, 9am to 6pm',
    },
  },

  // Not found screen
  notFound: {
    title: 'Oops!',
    message: 'This screen does not exist.',
    goHome: 'Go to home screen',
  },

  // Error boundary
  errorBoundary: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    retry: 'Try Again',
  },

  // Validation messages
  validation: {
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    passwordRequired: 'Password is required',
    passwordMin: 'Password must be at least 6 characters',
    nameRequired: 'Full name is required',
    nameMin: 'Name must be at least 2 characters',
    confirmPasswordRequired: 'Confirm your password',
    passwordsMustMatch: 'Passwords must match',
    cardholderRequired: 'Cardholder name is required',
    cardholderMin: 'Name must be at least 2 characters',
    cardNumberRequired: 'Card number is required',
    cardNumberInvalid: 'Invalid card number (16 digits)',
    expiryRequired: 'Expiry date is required',
    expiryInvalid: 'Invalid expiry date (MM/YY)',
    cvvRequired: 'CVV is required',
    cvvInvalid: 'Invalid CVV (3-4 digits)',
  },
} as const;
