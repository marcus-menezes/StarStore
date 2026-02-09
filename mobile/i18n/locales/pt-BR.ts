export default {
  // Common
  common: {
    error: 'Erro',
    back: 'Voltar',
    cancel: 'Cancelar',
    ok: 'OK',
    total: 'Total',
    signIn: 'Entrar',
    signUp: 'Cadastrar',
    createAccount: 'Criar Conta',
    loading: 'Carregando...',
    free: 'Grátis',
  },

  // Tab names
  tabs: {
    home: 'Início',
    cart: 'Carrinho',
    orders: 'Pedidos',
    profile: 'Perfil',
  },

  // Navigation headers
  nav: {
    productDetails: 'Detalhes do Produto',
    checkout: 'Pagamento',
  },

  // Login screen
  login: {
    title: 'StarStore',
    subtitle: 'Entre na sua conta',
    emailLabel: 'Email',
    emailPlaceholder: 'Digite seu email',
    passwordLabel: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    signInButton: 'Entrar',
    noAccount: 'Não tem uma conta? ',
    signUpLink: 'Cadastre-se',
    errorInvalidCredentials: 'Email ou senha inválidos',
  },

  // Register screen
  register: {
    title: 'Junte-se à StarStore',
    subtitle: 'Crie sua conta para começar a comprar',
    nameLabel: 'Nome Completo',
    namePlaceholder: 'Digite seu nome completo',
    emailLabel: 'Email',
    emailPlaceholder: 'Digite seu email',
    passwordLabel: 'Senha',
    passwordPlaceholder: 'Crie uma senha',
    confirmPasswordLabel: 'Confirmar Senha',
    confirmPasswordPlaceholder: 'Confirme sua senha',
    signUpButton: 'Criar Conta',
    hasAccount: 'Já tem uma conta? ',
    signInLink: 'Entrar',
    errorCreateAccount: 'Falha ao criar conta. Tente novamente.',
  },

  // Home screen
  home: {
    title: 'StarStore',
    subtitle: 'As melhores mercadorias da galáxia',
    searchPlaceholder: 'Buscar produtos...',
    allCategories: 'Todos',
    sortByRelevance: 'Relevância',
    sortByPriceLow: 'Menor preço',
    sortByPriceHigh: 'Maior preço',
    sortByName: 'A-Z',
    resultsCount: '{count} produtos',
    resultsCountSingle: '1 produto',
    noResults: 'Nenhum produto encontrado',
    noResultsSubtitle: 'Tente buscar com outros termos',
    errorLoadProducts: 'Falha ao carregar produtos',
    addToCart: 'Adicionar',
    addedToCart: 'Adicionado!',
    inStock: 'Em estoque',
    lowStock: 'Últimas unidades',
    outOfStock: 'Indisponível',
  },

  // Cart screen
  cart: {
    title: 'Carrinho de Compras',
    emptyTitle: 'Seu carrinho está vazio',
    emptySubtitle: 'Adicione alguns itens para começar',
    startShopping: 'Começar a Comprar',
    clearAll: 'Limpar Tudo',
    total: 'Total',
    proceedToCheckout: 'Ir para Pagamento',
  },

  // Checkout screen
  checkout: {
    orderSummary: 'Resumo do Pedido',
    items: 'Itens',
    shipping: 'Frete',
    total: 'Total',
    paymentDetails: 'Detalhes do Pagamento',
    cardholderName: 'Nome do Titular',
    cardholderPlaceholder: 'Nome no cartão',
    cardNumber: 'Número do Cartão',
    cardNumberPlaceholder: '1234 5678 9012 3456',
    expiryDate: 'Validade',
    expiryPlaceholder: 'MM/AA',
    cvv: 'CVV',
    cvvPlaceholder: '123',
    placeOrder: 'Finalizar Pedido',
    signInRequired: 'Login Necessário',
    signInRequiredMessage: 'Entre na sua conta para concluir a compra',
    emptyCart: 'Carrinho Vazio',
    emptyCartMessage: 'Seu carrinho está vazio',
    orderPlaced: 'Pedido Realizado!',
    orderPlacedMessage: 'Obrigado pela sua compra. Seu pedido foi realizado com sucesso.',
    errorPlaceOrder: 'Falha ao realizar pedido. Tente novamente.',
  },

  // History screen
  history: {
    title: 'Histórico de Pedidos',
    signInTitle: 'Entre para ver seus pedidos',
    signInSubtitle: 'Seu histórico de pedidos aparecerá aqui',
    errorTitle: 'Falha ao carregar pedidos',
    errorSubtitle: 'Verifique sua conexão e tente novamente',
    emptyTitle: 'Nenhum pedido ainda',
    emptySubtitle: 'Seu histórico de compras aparecerá aqui',
    orderPrefix: 'Pedido',
    moreItems: 'mais itens',
  },

  // Profile screen
  profile: {
    guestTitle: 'Bem-vindo à StarStore',
    guestSubtitle: 'Entre para acessar sua conta e acompanhar pedidos',
    signInButton: 'Entrar',
    createAccountButton: 'Criar Conta',
    defaultUserName: 'Usuário',
    editProfile: 'Editar Perfil',
    notifications: 'Notificações',
    settings: 'Configurações',
    helpSupport: 'Ajuda e Suporte',
    signingOut: 'Saindo...',
    signOut: 'Sair',
  },

  // Product detail screen
  product: {
    notFound: 'Produto não encontrado',
    goBack: 'Voltar',
    soldBy: 'Vendido por',
    description: 'Descrição',
    category: 'Categoria',
    addToCart: 'Adicionar ao Carrinho',
  },

  // Not found screen
  notFound: {
    title: 'Ops!',
    message: 'Esta tela não existe.',
    goHome: 'Ir para tela inicial',
  },

  // Error boundary
  errorBoundary: {
    title: 'Algo deu errado',
    message: 'Ocorreu um erro inesperado. Tente novamente.',
    retry: 'Tentar Novamente',
  },

  // Validation messages
  validation: {
    emailRequired: 'Email é obrigatório',
    emailInvalid: 'Digite um email válido',
    passwordRequired: 'Senha é obrigatória',
    passwordMin: 'Senha deve ter pelo menos 6 caracteres',
    nameRequired: 'Nome completo é obrigatório',
    nameMin: 'Nome deve ter pelo menos 2 caracteres',
    confirmPasswordRequired: 'Confirme sua senha',
    passwordsMustMatch: 'As senhas não conferem',
    cardholderRequired: 'Nome do titular é obrigatório',
    cardholderMin: 'Nome deve ter pelo menos 2 caracteres',
    cardNumberRequired: 'Número do cartão é obrigatório',
    cardNumberInvalid: 'Número do cartão inválido (16 dígitos)',
    expiryRequired: 'Data de validade é obrigatória',
    expiryInvalid: 'Data de validade inválida (MM/AA)',
    cvvRequired: 'CVV é obrigatório',
    cvvInvalid: 'CVV inválido (3-4 dígitos)',
  },
} as const;
