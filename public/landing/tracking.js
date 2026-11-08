(function () {
  "use strict";

  const config = window.SALES_PAGE_CONFIG;
  const pixelConfig = config?.analytics?.metaPixel;
  const consentConfig = config?.analytics?.consent || {};
  const debugEvents = window.__META_PIXEL_DEBUG_EVENTS__ = window.__META_PIXEL_DEBUG_EVENTS__ || [];
  const firedEvents = new Set();
  let initialized = false;

  if (!pixelConfig?.enabled || !pixelConfig.id) return;

  const debugMode = Boolean(config.developmentMode && !pixelConfig.enableInDevelopment);
  const storageKey = consentConfig.storageKey || "marketing-consent";

  function readConsent() {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }

  function writeConsent(value) {
    try { localStorage.setItem(storageKey, value); } catch { /* armazenamento indisponível */ }
  }

  function installOfficialPixel() {
    if (window.fbq) return;
    const fbq = window.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.metaPixel = pixelConfig.id;
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  function send(method, eventName, parameters) {
    const entry = { method, eventName, parameters: parameters || {} };
    if (debugMode) {
      debugEvents.push(entry);
      console.info(`[Meta Pixel debug] ${JSON.stringify(entry)}`);
      window.dispatchEvent(new CustomEvent("meta-pixel-debug-event", { detail: entry }));
      return;
    }
    if (parameters === undefined) window.fbq(method, eventName);
    else window.fbq(method, eventName, parameters);
  }

  function sendOnce(method, eventName, parameters) {
    const key = `${method}:${eventName}`;
    if (firedEvents.has(key)) return;
    firedEvents.add(key);
    send(method, eventName, parameters);
  }

  function initializePixel() {
    if (initialized) return;
    initialized = true;
    if (!debugMode) {
      installOfficialPixel();
      window.fbq("init", pixelConfig.id);
    }
    sendOnce("track", "PageView");
    sendOnce("track", "ViewContent", {
      content_name: config.productName,
      content_type: "product",
      content_category: "produto digital"
    });
  }

  function removeConsentNotice() {
    document.getElementById("marketing-consent")?.remove();
  }

  function grantMarketingConsent() {
    writeConsent("granted");
    removeConsentNotice();
    initializePixel();
  }

  function denyMarketingConsent() {
    writeConsent("denied");
    removeConsentNotice();
  }

  function showConsentNotice() {
    if (document.getElementById("marketing-consent")) return;
    const notice = document.createElement("aside");
    notice.className = "marketing-consent";
    notice.id = "marketing-consent";
    notice.setAttribute("aria-label", "Preferências de cookies de marketing");
    notice.innerHTML = `<p><strong>Cookies de marketing</strong><br>Com sua permissão, usamos o Meta Pixel para medir visitas e cliques nos planos. Nenhum dado de compra é registrado nesta página.</p><div class="marketing-consent__actions"><button type="button" data-consent-deny>Recusar</button><button type="button" data-consent-accept>Aceitar</button></div>`;
    document.body.appendChild(notice);
    notice.querySelector("[data-consent-accept]").addEventListener("click", grantMarketingConsent);
    notice.querySelector("[data-consent-deny]").addEventListener("click", denyMarketingConsent);
  }

  function parseBrlPrice(value) {
    const normalized = String(value || "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const checkoutOffers = {
    basic: { plan: "Plano Básico", value: parseBrlPrice(config.prices?.basic), click_origin: "Básico" },
    premium_normal: { plan: "Plano Premium", value: parseBrlPrice(config.prices?.premium), click_origin: "Premium normal" },
    premium_upgrade: { plan: "Plano Premium", value: parseBrlPrice(config.upgradeOffer?.price), click_origin: "Pop-up" }
  };

  function trackCheckoutClick(key) {
    if (!initialized) return false;
    const offer = checkoutOffers[key];
    if (!offer) return false;
    send("trackCustom", "CheckoutClick", { ...offer, currency: "BRL" });
    return true;
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest("[data-checkout-track]");
    if (!link || event.defaultPrevented) return;
    trackCheckoutClick(link.dataset.checkoutTrack);
  });

  window.SALES_TRACKING = Object.freeze({
    grantMarketingConsent,
    denyMarketingConsent,
    trackCheckoutClick,
    getConsent: readConsent
  });

  const consent = readConsent();
  if (!consentConfig.required || consent === "granted") initializePixel();
  else if (consent !== "denied") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showConsentNotice, { once: true });
    else showConsentNotice();
  }
})();

