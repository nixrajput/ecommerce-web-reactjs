import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { deleteProduct } from "../../../../redux/actions/productAction";
import ProductList from ".";

const grid = vi.hoisted(() => ({ columns: [] }));

vi.mock("../../../hoc/AppWrap", () => ({ default: (Component) => Component }));
vi.mock("../sidebar", () => ({ default: () => null }));
vi.mock("react-alert", () => ({ useAlert: () => ({}) }));
vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ columns }) => {
    grid.columns = columns;
    return null;
  },
}));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select) =>
    select({ user: { token: "admin-token" }, products: {}, product: {} }),
}));
vi.mock("../../../../redux/actions/productAction", () => ({
  clearErrors: vi.fn(),
  getAdminProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

describe("admin ProductList", () => {
  it("sends the admin token with the delete", () => {
    renderToString(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    const actions = grid.columns.find((column) => column.field === "actions");
    const [, deleteButton] = actions.renderCell({ row: { id: "p1" } }).props
      .children;
    deleteButton.props.onClick();

    expect(deleteProduct).toHaveBeenCalledWith("p1", "admin-token");
  });
});
