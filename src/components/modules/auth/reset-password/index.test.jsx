import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { resetPassword } from "../../../../redux/actions/userAction";
import ResetPassword from ".";

vi.mock("react-alert", () => ({ useAlert: () => ({}) }));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select) => select({ forgotPassword: {} }),
}));
vi.mock("../../../../redux/actions/userAction", () => ({
  clearErrors: vi.fn(),
  resetPassword: vi.fn(),
}));

const findForm = (element) =>
  element?.type === "form"
    ? element
    : [element?.props?.children ?? []].flat().map(findForm).find(Boolean);

describe("ResetPassword", () => {
  it("sends the fields the API reads", () => {
    let tree;
    function Probe() {
      tree = ResetPassword();
      return null;
    }
    renderToString(
      <MemoryRouter initialEntries={["/reset/abc"]}>
        <Routes>
          <Route path="/reset/:token" element={<Probe />} />
        </Routes>
      </MemoryRouter>
    );

    findForm(tree).props.onSubmit({ preventDefault: () => {} });

    const [token, form] = resetPassword.mock.calls[0];
    expect(token).toBe("abc");
    expect(Object.fromEntries(form)).toEqual({
      newPassword: "",
      confirmPassword: "",
    });
  });
});
