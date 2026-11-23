import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { updatePassword } from "../../../../redux/actions/userAction";
import UpdatePassword from ".";

vi.mock("../../../hoc/AppWrap", () => ({ default: (Component) => Component }));
vi.mock("react-alert", () => ({ useAlert: () => ({}) }));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select) =>
    select({ user: { token: "old-token" }, profile: {} }),
}));
vi.mock("../../../../redux/actions/userAction", () => ({
  clearErrors: vi.fn(),
  updatePassword: vi.fn(),
}));

describe("UpdatePassword", () => {
  it("sends the passwords and the token", () => {
    let tree;
    function Probe() {
      tree = UpdatePassword();
      return null;
    }
    renderToString(
      <MemoryRouter>
        <Probe />
      </MemoryRouter>
    );

    const form = tree.props.children.props.children.find(
      (child) => child?.type === "form"
    );
    form.props.onSubmit({ preventDefault: () => {} });

    expect(updatePassword).toHaveBeenCalledWith(
      { oldPassword: "", newPassword: "", confirmPassword: "" },
      "old-token"
    );
  });
});
