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
    orderDetails: 'Detalhes do Pedido',
    editProfile: 'Editar Perfil',
    help: 'Ajuda e Suporte',
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
    clearCart: 'Limpar Carrinho',
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
    signInAction: 'Entrar',
    errorTitle: 'Falha ao carregar pedidos',
    errorSubtitle: 'Verifique sua conexão e tente novamente',
    emptyTitle: 'Nenhum pedido ainda',
    emptySubtitle: 'Seu histórico de compras aparecerá aqui',
    orderPrefix: 'Pedido',
    moreItems: 'mais itens',
    viewDetails: 'Ver detalhes',
  },

  // Order detail screen
  orderDetail: {
    notFound: 'Pedido não encontrado',
    orderNumber: 'Nº do Pedido',
    placedOn: 'Realizado em',
    updatedOn: 'Atualizado em',
    statusTitle: 'Acompanhamento',
    status_pending: 'Pendente',
    status_processing: 'Processando',
    status_shipped: 'Enviado',
    status_delivered: 'Entregue',
    status_cancelled: 'Cancelado',
    statusCancelled: 'Este pedido foi cancelado',
    items: 'Itens',
    qty: 'Qtd',
    payment: 'Pagamento',
    summary: 'Resumo',
    subtotal: 'Subtotal',
    shipping: 'Frete',
  },

  // Profile screen
  profile: {
    guestTitle: 'Bem-vindo à StarStore',
    guestSubtitle: 'Entre para acessar sua conta e acompanhar pedidos',
    signInButton: 'Entrar',
    createAccountButton: 'Criar Conta',
    defaultUserName: 'Usuário',
    editProfile: 'Editar Perfil',
    helpSupport: 'Ajuda e Suporte',
    signingOut: 'Saindo...',
    signOut: 'Sair',
  },

  // Settings in drawer
  settings: {
    title: 'Configurações',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    themeSystem: 'Sistema',
    language: 'Idioma',
    languagePt: 'Português',
  },

  // Edit profile screen
  editProfile: {
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome completo',
    nameMin: 'O nome deve ter pelo menos 2 caracteres',
    emailLabel: 'Email',
    emailHint: 'O email não pode ser alterado',
    memberSince: 'Membro desde',
    save: 'Salvar Alterações',
    successTitle: 'Perfil Atualizado',
    successMessage: 'Suas informações foram salvas com sucesso.',
    errorMessage: 'Não foi possível salvar. Tente novamente.',
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

  // Help & Support screen
  help: {
    title: 'Como podemos ajudar?',
    subtitle: 'Encontre respostas ou entre em contato conosco',
    faqTitle: 'Perguntas Frequentes',
    faq: {
      q1: 'Como acompanho meu pedido?',
      a1: 'Acesse a aba "Pedidos" no menu inferior do app. Lá você encontra todos os seus pedidos e pode ver o status atualizado de cada um tocando no pedido desejado.',
      q2: 'Qual o prazo de entrega?',
      a2: 'O prazo de entrega varia de acordo com a sua região. Em média, as entregas são realizadas entre 5 a 15 dias úteis após a confirmação do pagamento.',
      q3: 'Como faço para trocar ou devolver um produto?',
      a3: 'Você tem até 7 dias após o recebimento para solicitar a troca ou devolução. Entre em contato pelo nosso WhatsApp ou email informando o número do pedido.',
      q4: 'Quais formas de pagamento são aceitas?',
      a4: 'Aceitamos cartões de crédito das bandeiras Visa, Mastercard, Elo, Amex e Hipercard. Em breve teremos também PIX e boleto bancário.',
      q5: 'Os produtos são originais?',
      a5: 'Sim! Todos os produtos vendidos na StarStore são originais e licenciados oficialmente. Trabalhamos apenas com fornecedores autorizados pela Lucasfilm.',
    },
    contactTitle: 'Fale Conosco',
    contact: {
      email: 'Email',
      emailValue: 'suporte@starstore.com.br',
      whatsapp: 'WhatsApp',
      whatsappValue: '(11) 99999-9999',
      hours: 'Horário de Atendimento',
      hoursValue: 'Seg a Sex, 9h às 18h',
    },
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
