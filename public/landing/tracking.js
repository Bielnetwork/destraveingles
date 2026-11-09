(function () {
  "use strict";

  const config = window.SALES_PAGE_CONFIG;
  const debugEvents = window.__META_PIXEL_DEBUG_EVENTS__ = window.__META_PIXEL_DEBUG_EVENTS__ || [];
  const runtime = window.__DESTRAVE_META_PIXEL_RUNTIME__ = window.__DESTRAVE_META_PIXEL_RUNTIME__ || {
    initialized: false,
    clickListenerAttached: false,
    firedEvents: new Set()
  };

  function send(method, eventName, parameters) {
    const entry = { method, eventName, parameters: parameters || {} };
    if (typeof window.fbq !== "function") {
      debugEvents.push(entry);
      window.dispatchEvent(new CustomEvent("meta-pixel-debug-event", { detail: entry }));
      return;
    }
    if (parameters === undefined) window.fbq(method, eventName);
    else window.fbq(method, eventName, parameters);
  }

  function sendOnce(method, eventName, parameters) {
    const key = `${method}:${eventName}`;
    if (runtime.firedEvents.has(key)) return;
    runtime.firedEvents.add(key);
    send(method, eventName, parameters);
  }

  function initializeTracking() {
    if (runtime.initialized) return;
    runtime.initialized = true;
    sendOnce("track", "ViewContent", {
      content_name: config.productName,
      content_type: "product",
      content_category: "produto digital"
    });
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
    if (!runtime.initialized) return false;
    const offer = checkoutOffers[key];
    if (!offer) return false;
    send("trackCustom", "CheckoutClick", { ...offer, currency: "BRL" });
    return true;
  }

  if (!runtime.clickListenerAttached) {
    runtime.clickListenerAttached = true;
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest("[data-checkout-track]");
      if (!link || event.defaultPrevented) return;
      trackCheckoutClick(link.dataset.checkoutTrack);
    });
  }

  window.SALES_TRACKING = Object.freeze({
    trackCheckoutClick
  });

  initializeTracking();
})();


