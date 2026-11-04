(function () {
  "use strict";

  const config = window.SALES_PAGE_CONFIG;
  if (!config) throw new Error("SALES_PAGE_CONFIG não foi carregado.");

  const bonusData = [
    { title: "40 Diálogos para Situações Reais", description: "Aprenda a desenvolver respostas e compreender conversas comuns em inglês, com diálogos traduzidos e atividades para praticar.", benefit: "Pratique conversas do cotidiano." },
    { title: "200 Palavras Essenciais + 50 Combinações Prontas", description: "Amplie seu vocabulário com palavras e combinações úteis para construir frases do cotidiano.", benefit: "Ganhe repertório para novas frases." },
    { title: "Inglês em 10 Minutos — Plano de 30 Dias", description: "Tenha um roteiro organizado para estudar, revisar e praticar inglês com pequenas atividades diárias.", benefit: "Mantenha uma rotina organizada." },
    { title: "Inglês em Contexto — 30 Mini-Histórias", description: "Aprenda a reconhecer palavras e estruturas dentro de pequenas histórias, com tradução e atividades de interpretação.", benefit: "Observe o inglês em contexto." }
  ];

  const plans = [
    {
      key: "basic", name: "Plano Básico", badge: "PRODUTO PRINCIPAL", featured: false,
      items: ["Produto principal", "90 lições visuais", "180 páginas ilustradas", "Exercícios e gabarito", "PDF colorido imprimível"],
      cta: "QUERO O PLANO BÁSICO"
    },
    {
      key: "premium", name: "Plano Premium", badge: "", featured: true,
      items: ["Tudo do Plano Básico", "Bônus 1: 40 Diálogos", "Bônus 2: 200 Palavras + 50 Combinações", "Bônus 3: Plano de 30 Dias", "Bônus 4: 30 Mini-Histórias"],
      cta: "QUERO O PLANO PREMIUM"
    }
  ];

  const faqs = [
    ["Preciso saber inglês para começar?", "Não. O material começa com estruturas básicas e apresenta a construção das frases passo a passo."],
    ["O conteúdo é indicado para iniciantes?", "Sim. Ele foi organizado para quem está começando ou conhece algumas palavras, mas ainda tem dificuldade para organizar frases."],
    ["Como funcionam as 180 páginas?", "São 90 lições. Cada lição tem uma página para aprender e construir a estrutura e outra para praticar e revisar."],
    ["Posso imprimir o material?", "Sim. O PDF é colorido, em formato A4 horizontal e está preparado para impressão."],
    ["Posso estudar pelo celular?", "Sim. O arquivo em PDF pode ser visualizado pelo celular em um aplicativo compatível."],
    ["O produto contém exercícios?", "Sim. O material inclui exercícios e gabarito para praticar e revisar o conteúdo."],
    ["Qual é a diferença entre o Básico e o Premium?", "O Básico inclui o produto principal. O Premium inclui todo o Plano Básico e mais quatro materiais bônus: diálogos, vocabulário e combinações, plano de 30 dias e mini-histórias."],
    ["Como receberei o material após a compra?", config.delivery.method || "A forma exata de entrega ainda será configurada e informada antes da publicação."],
    ["Por quanto tempo terei acesso?", config.delivery.accessPeriod || "O prazo de acesso ainda será definido e informado antes da publicação."],
    ["Como funciona a garantia?", config.guarantee.policyText || "Você tem até 7 dias após a compra para solicitar o reembolso, conforme as condições da garantia."]
  ];

  const esc = (value) => String(value || "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  function renderHero() {
    if (!config.images.heroMockup) return;
    const visual = document.getElementById("hero-visual");
    if (visual.querySelector(".hero__mockup-image")) return;
    const responsiveSource = config.images.heroMockup.endsWith("mockup-produto-ingles.webp")
      ? ` srcset="assets/mockup-produto-ingles-480.webp 480w, ${esc(config.images.heroMockup)} 900w" sizes="(max-width: 680px) 244px, 572px"`
      : "";
    visual.innerHTML = `<img class="hero__mockup-image" src="${esc(config.images.heroMockup)}"${responsiveSource} alt="Mockup do produto ${esc(config.productName)}" width="900" height="985" fetchpriority="high" decoding="async">`;
    visual.removeAttribute("aria-label");
  }

  function placeholder(kind, number, label) {
    return `<div class="placeholder placeholder--${kind}" aria-label="Imagem pendente"><span>${number || "IMG"}</span><strong>${esc(label)}</strong><small>imagem a inserir</small></div>`;
  }

  function renderProductGallery() {
    const gallery = document.getElementById("product-gallery");
    const items = config.images.productPages.map((item, index) => {
      const media = item.src
        ? `<button class="product-media product-media--clickable" type="button" data-lightbox-src="${esc(item.src)}" data-lightbox-alt="${esc(item.title)}"><img src="${esc(item.src)}" alt="${esc(item.title)}" width="1024" height="720" loading="lazy" decoding="async"></button>`
        : `<div class="product-media">${placeholder("page", String(index + 1).padStart(2, "0"), "Página real do produto")}</div>`;
      return `<article class="product-card">${media}<div class="product-card__copy"><span>EXEMPLO ${String(index + 1).padStart(2, "0")}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div></article>`;
    }).join("");
    const duplicateItems = items.replaceAll("<button ", "<button tabindex=\"-1\" ");
    gallery.innerHTML = `<div class="product-marquee"><div class="product-marquee__group">${items}</div><div class="product-marquee__group" aria-hidden="true">${duplicateItems}</div></div>`;
  }

  function renderTestimonials() {
    const section = document.getElementById("depoimentos");
    if (!config.testimonials.enabled) {
      section.hidden = true;
      return;
    }
    const gallery = document.getElementById("testimonial-gallery");
    if (config.testimonials.images.length) {
      gallery.innerHTML = config.testimonials.images.map((src, index) => `<button class="testimonial-card testimonial-card--real" type="button" data-lightbox-src="${esc(src)}" data-lightbox-alt="Depoimento real ${index + 1}"><img src="${esc(src)}" alt="Depoimento real ${index + 1}" loading="lazy"></button>`).join("");
    } else {
      gallery.innerHTML = [1, 2, 3].map((number) => `<div class="testimonial-card">${placeholder("testimonial", number, "Print de depoimento real")}</div>`).join("");
    }
  }

  function renderBonuses() {
    const grid = document.getElementById("bonus-grid");
    grid.innerHTML = bonusData.map((bonus, index) => {
      const src = config.images.bonuses[index];
      const cover = src ? `<img src="${esc(src)}" alt="Capa do bônus ${esc(bonus.title)}" loading="lazy">` : placeholder("bonus", `0${index + 1}`, "Capa do bônus");
      return `<article class="bonus-card"><div class="bonus-card__cover">${cover}</div><div class="bonus-card__copy"><span>BÔNUS ${index + 1}</span><h3>${esc(bonus.title)}</h3><p>${esc(bonus.benefit)}</p></div></article>`;
    }).join("");
  }

  function renderOffers() {
    const grid = document.getElementById("offer-grid");
    grid.innerHTML = plans.map((plan) => {
      const price = config.prices[plan.key];
      const checkout = config.checkout[plan.key];
      const priceMarkup = price ? `<p class="offer-card__price"><small>Por</small><strong>${esc(price)}</strong></p>` : `<p class="offer-card__pending">Preço a definir</p>`;
      const buttonClass = plan.featured ? "button--yellow button--premium" : "button--blue";
      const button = checkout
        ? `<a class="button ${buttonClass}" href="${esc(checkout)}" rel="noopener">${esc(plan.cta)} <span aria-hidden="true">→</span></a>`
        : `<button class="button ${buttonClass}" type="button" disabled aria-describedby="${plan.key}-checkout-note">${esc(plan.cta)}</button>`;
      const badge = plan.featured
        ? (config.developmentMode ? config.premiumBadge.developmentText : config.premiumBadge.publicText)
        : plan.badge;
      const offerImage = config.images.offers && config.images.offers[plan.key]
        ? `<img class="offer-card__visual" src="${esc(config.images.offers[plan.key])}" alt="Apresentação visual do ${esc(plan.name)}" width="900" height="1124" loading="lazy" decoding="async">`
        : "";
      const list = `<ul>${plan.items.map((item) => `<li><span aria-hidden="true">✓</span>${esc(item)}</li>`).join("")}</ul>`;
      const purchase = `${button}${!checkout ? `<small class="offer-card__checkout-note" id="${plan.key}-checkout-note">Checkout ainda não configurado.</small>` : ""}`;
      const body = plan.featured ? `${list}${priceMarkup}${purchase}` : `${priceMarkup}${list}${purchase}`;
      const badgeMarkup = `<p class="offer-card__badge${plan.featured ? " offer-card__badge--featured" : ""}">${esc(badge)}</p>`;
      const offerHeader = plan.featured ? `${badgeMarkup}${offerImage}` : `${offerImage}${badgeMarkup}`;
      return `<article class="offer-card ${plan.featured ? "offer-card--featured" : "offer-card--basic"}">${offerHeader}<h3>${esc(plan.name)}</h3><p class="offer-card__intro">${plan.featured ? "Produto principal + quatro bônus para ampliar sua prática." : "O material principal para aprender a construir e praticar frases."}</p>${body}</article>`;
    }).join("");
  }

  function renderGuarantee() {
    const period = config.guarantee.period;
    const policy = config.guarantee.policyText;
    if (!period && !policy) return;
    document.getElementById("guarantee-title").textContent = `${period.toUpperCase()} DE GARANTIA`;
    document.getElementById("guarantee-copy").textContent = policy;
    document.getElementById("guarantee-dev-note").hidden = true;
  }

  function renderFaq() {
    document.getElementById("faq-list").innerHTML = faqs.map(([question, answer], index) => `<details class="faq-item" ${index === 0 ? "open" : ""}><summary><span>${esc(question)}</span><i aria-hidden="true">+</i></summary><div><p>${esc(answer)}</p>${index >= 7 && ![config.delivery.method, config.delivery.accessPeriod, config.guarantee.policyText][index - 7] ? `<small class="dev-note">Pendente de configuração.</small>` : ""}</div></details>`).join("");
  }

  function renderFooter() {
    const legal = config.legal;
    document.getElementById("footer-product").textContent = config.productName;
    const links = [
      ["Política de Privacidade", legal.privacyUrl],
      ["Termos de Uso", legal.termsUrl],
      [legal.supportLabel || "Suporte", legal.supportUrl]
    ].filter(([, url]) => url);
    document.getElementById("footer-links").innerHTML = links.map(([label, url]) => `<a href="${esc(url)}">${esc(label)}</a>`).join("");
    const owner = legal.copyrightOwner || config.productName;
    document.getElementById("footer-copy").textContent = `© ${new Date().getFullYear()} ${owner}. Todos os direitos reservados.`;
    if (legal.companyInfo) {
      document.getElementById("footer-pending").textContent = legal.companyInfo;
      document.getElementById("footer-pending").classList.remove("dev-note");
    }
  }

  function initCarousels() {
    document.querySelectorAll("[data-carousel-prev], [data-carousel-next]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.carouselPrev || button.dataset.carouselNext);
        const direction = button.hasAttribute("data-carousel-next") ? 1 : -1;
        target.scrollBy({ left: target.clientWidth * 0.78 * direction, behavior: "smooth" });
      });
    });
  }

  function initLightbox() {
    const dialog = document.getElementById("lightbox");
    const image = dialog.querySelector("img");
    const caption = dialog.querySelector("p");
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox-src]");
      if (!trigger) return;
      image.src = trigger.dataset.lightboxSrc;
      image.alt = trigger.dataset.lightboxAlt;
      caption.textContent = trigger.dataset.lightboxAlt;
      dialog.showModal();
    });
    dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        document.querySelectorAll(".faq-item[open]").forEach((other) => { if (other !== item) other.removeAttribute("open"); });
      });
    });
  }

  function init() {
    document.documentElement.classList.add("js");
    document.body.classList.toggle("is-development", Boolean(config.developmentMode));
    renderHero();
    renderProductGallery();
    renderTestimonials();
    renderBonuses();
    renderOffers();
    renderGuarantee();
    renderFaq();
    renderFooter();
    initCarousels();
    initLightbox();
    initFaq();
  }

  init();
})();
