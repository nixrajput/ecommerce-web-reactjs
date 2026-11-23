import { describe, expect, it } from "vitest";
import { getSafeRedirect } from "./redirect";

const origin = "https://shop.example";

describe("getSafeRedirect", () => {
  it("keeps the in-app redirect the cart sends", () => {
    expect(getSafeRedirect("?redirect=checkout/shipping", origin)).toBe(
      "/checkout/shipping"
    );
  });

  it("returns null when there is no redirect", () => {
    expect(getSafeRedirect("", origin)).toBeNull();
    expect(getSafeRedirect("?other=1", origin)).toBeNull();
  });

  it.each([
    "//evil.example",
    "/%2Fevil.example",
    "/%5Cevil.example",
    "/%09/evil.example",
    "https://evil.example/login",
    // eslint-disable-next-line no-script-url -- the blocked scheme is the input under test
    "javascript:alert(1)",
  ])("blocks off-site target %s", (value) => {
    expect(getSafeRedirect(`?redirect=${value}`, origin)).toBeNull();
  });

  it("collapses leading slashes left after dot segments", () => {
    expect(getSafeRedirect("?redirect=/.//evil.example", origin)).toBe(
      "/evil.example"
    );
  });
});
