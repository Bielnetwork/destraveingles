/*
 * CONFIGURAÇÃO CENTRAL DA PÁGINA
 * Preencha somente com dados reais antes de publicar.
 * Strings vazias mantêm os respectivos dados ocultos ou sinalizados no modo de desenvolvimento.
 */
window.SALES_PAGE_CONFIG = {
  developmentMode:
    /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ||
    window.location.hostname.endsWith(".lovableproject.com") ||
    window.location.hostname.startsWith("preview--"),
  productName: "Destrave suas Frases em Inglês",
  prices: {
    basic: "R$ 9,90",
    premium: "R$ 19,90"
  },
  checkout: {
    basic: "",
    premium: ""
  },
  premiumBadge: {
    developmentText: "⭐ MAIS VENDIDO",
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
      { title: "Sujeito da frase", description: "Aprenda a identificar e organizar o sujeito passo a passo.", src: "assets/pagina-sujeito-construir.webp" },
      { title: "Praticar e revisar", description: "Aplique a estrutura com exemplos, correções e prática guiada.", src: "assets/pagina-sujeito-praticar.webp" },
      { title: "This, that, these e those", description: "Veja como construir frases com demonstrativos.", src: "assets/pagina-demonstrativos-construir.webp" },
      { title: "Prática com demonstrativos", description: "Revise usos, erros comuns e exercícios da lição.", src: "assets/pagina-demonstrativos-praticar.webp" },
      { title: "Artigos: a, an e the", description: "Entenda a escolha do artigo com um caminho visual.", src: "assets/pagina-artigos-construir.webp" },
      { title: "Prática com artigos", description: "Fixe o conteúdo com exemplos e atividades guiadas.", src: "assets/pagina-artigos-praticar.webp" }
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
