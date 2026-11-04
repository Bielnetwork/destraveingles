/*
 * CONFIGURAÇÃO CENTRAL DA PÁGINA
 * Preencha somente com dados reais antes de publicar.
 * Strings vazias mantêm os respectivos dados ocultos ou sinalizados no modo de desenvolvimento.
 */
window.SALES_PAGE_CONFIG = {
  developmentMode: true,
  productName: "Destrave suas Frases em Inglês",
  prices: {
    basic: "",
    premium: ""
  },
  checkout: {
    basic: "",
    premium: ""
  },
  premiumBadge: {
    developmentText: "⭐ PACOTE MAIS VENDIDO",
    publicText: "PACOTE MAIS COMPLETO"
  },
  guarantee: {
    period: "7 dias",
    policyText: "Se não atender às suas expectativas, você pode solicitar o reembolso em até 7 dias após a compra, conforme as condições da garantia."
  },
  delivery: {
    method: "",
    accessPeriod: ""
  },
  images: {
    heroMockup: "assets/mockup-produto-ingles.webp",
    offers: {
      basic: "assets/oferta-plano-basico.webp",
      premium: "assets/oferta-plano-premium.webp"
    },
    productPages: [
      { title: "Aprender e Construir", description: "O caminho visual para entender e montar a estrutura.", src: "" },
      { title: "Praticar e Revisar", description: "Exercícios para aplicar e revisar o conteúdo da lição.", src: "" },
      { title: "Conteúdo intermediário", description: "Estruturas que ampliam as possibilidades de comunicação.", src: "" },
      { title: "Conteúdo avançado", description: "Construções mais completas para avançar com lógica.", src: "" },
      { title: "Mais uma página do material", description: "Espaço preparado para inserir a quinta página real do produto.", src: "" }
    ],
    bonuses: ["", "", "", ""]
  },
  testimonials: {
    enabled: true,
    images: []
  },
  legal: {
    copyrightOwner: "",
    privacyUrl: "",
    termsUrl: "",
    supportLabel: "",
    supportUrl: "",
    companyInfo: ""
  }
};