import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { logout } from "../../../redux/actions/userAction";
import Header from "./Header";

const menu = vi.hoisted(() => ({ items: [] }));

vi.mock("@mui/material/Menu", () => ({
  default: ({ children }) => {
    menu.items = children;
    return null;
  },
}));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select) =>
    select({
      user: { isAuthenticated: true, user: { role: "user" }, token: "user-token" },
      cart: { cartItems: [] },
    }),
}));
vi.mock("../../../redux/actions/userAction", () => ({ logout: vi.fn() }));

describe("Header", () => {
  it("logs out with the signed-in token", () => {
    renderToString(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const item = menu.items.find((child) => child.props.children.includes("Logout"));
    item.props.onClick();

    expect(logout).toHaveBeenCalledWith("user-token");
  });
});
