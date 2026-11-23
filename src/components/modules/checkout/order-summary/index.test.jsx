import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import OrderSummary from ".";

vi.mock("../../../hoc/AppWrap", () => ({ default: (Component) => Component }));
vi.mock("react-redux", () => ({
  useSelector: (select) =>
    select({
      cart: {
        shippingInfo: {},
        cartItems: [{ product: "p1", name: "Shoe", price: 100, quantity: 1 }],
      },
      user: { user: { name: "Test" } },
    }),
}));

describe("OrderSummary", () => {
  it("links each item to its product page", () => {
    const html = renderToString(
      <MemoryRouter>
        <OrderSummary />
      </MemoryRouter>
    );

    expect(html.match(/href="[^"]*"/g)).toEqual(['href="/products/p1"']);
  });
});
