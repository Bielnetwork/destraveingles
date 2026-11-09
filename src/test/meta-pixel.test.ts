import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const trackingSource = readFileSync(resolve(process.cwd(), "public/landing/tracking.js"), "utf8");
const landingSource = readFileSync(resolve(process.cwd(), "public/landing/index.html"), "utf8");
const testWindow = window as typeof window & Record<string, any>;

function runTrackingScript() {
  new Function(trackingSource)();
}

beforeEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
  [
    "SALES_PAGE_CONFIG",
    "SALES_TRACKING",
    "__META_PIXEL_DEBUG_EVENTS__",
    "__DESTRAVE_META_PIXEL_RUNTIME__",
    "fbq",
    "_fbq",
  ].forEach((key) => delete testWindow[key]);

  testWindow.SALES_PAGE_CONFIG = {
    developmentMode: true,
    productName: "Destrave suas Frases em Inglês",
    analytics: { metaPixel: { id: "1135912255500773", enabled: true, enableInDevelopment: false } },
    prices: { basic: "R$ 9,90", premium: "R$ 19,90" },
    upgradeOffer: { price: "R$ 14,90" },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Meta Pixel da página de vendas", () => {
  it("mantém o código oficial do Pixel e não duplica eventos auxiliares nem listeners", () => {
    expect(landingSource).toContain("fbq('init', '1135912255500773');");
    expect(landingSource).toContain("fbq('track', 'PageView');");
    expect(landingSource).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(landingSource).toContain("https://www.facebook.com/tr?id=1135912255500773&ev=PageView&noscript=1");

    const fbq = vi.fn();
    testWindow.fbq = fbq;

    runTrackingScript();
    runTrackingScript();

    const checkoutButton = document.createElement("button");
    checkoutButton.dataset.checkoutTrack = "premium_normal";
    document.body.appendChild(checkoutButton);
    checkoutButton.click();

    expect(fbq.mock.calls.filter(([, eventName]) => eventName === "PageView")).toHaveLength(0);
    expect(fbq.mock.calls.filter(([, eventName]) => eventName === "ViewContent")).toHaveLength(1);
    expect(fbq.mock.calls.filter(([, eventName]) => eventName === "CheckoutClick")).toHaveLength(1);
    expect(document.getElementById("marketing-consent")).toBeNull();
  });
});

