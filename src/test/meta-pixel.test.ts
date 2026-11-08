import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const trackingSource = readFileSync(resolve(process.cwd(), "public/landing/tracking.js"), "utf8");
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
  it("inicializa automaticamente sem aviso e não duplica eventos nem listeners", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    runTrackingScript();
    runTrackingScript();

    const checkoutButton = document.createElement("button");
    checkoutButton.dataset.checkoutTrack = "premium_normal";
    document.body.appendChild(checkoutButton);
    checkoutButton.click();

    const messages = consoleSpy.mock.calls.map(([message]) => String(message));
    expect(messages.filter((message) => message.includes('"eventName":"PageView"'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('"eventName":"ViewContent"'))).toHaveLength(1);
    expect(messages.filter((message) => message.includes('"eventName":"CheckoutClick"'))).toHaveLength(1);
    expect(document.getElementById("marketing-consent")).toBeNull();
  });
});
