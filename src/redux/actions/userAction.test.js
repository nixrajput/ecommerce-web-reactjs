import { afterEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../api/apiClient";
import store from "../store";
import { LOGIN_SUCCESS } from "../constants/userConstants";
import { updatePassword } from "./userAction";

vi.mock("../../api/apiClient", () => ({ default: { put: vi.fn() } }));

describe("updatePassword", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("stores the new token the API returns", async () => {
    const storage = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
    });
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: { name: "Test" }, token: "old-token" },
    });
    apiClient.put.mockResolvedValue({
      status: 200,
      success: true,
      token: "new-token",
      expiresAt: 1900000000,
    });
    const passwords = { oldPassword: "a", newPassword: "b", confirmPassword: "b" };

    await store.dispatch(updatePassword(passwords, "old-token"));

    expect(apiClient.put).toHaveBeenCalledWith("/password/update", passwords, {
      headers: { Authorization: "Bearer old-token" },
    });
    expect(localStorage.getItem("token")).toBe("new-token");
    expect(localStorage.getItem("expiresAt")).toBe("1900000000");
    expect(store.getState().user).toMatchObject({
      isAuthenticated: true,
      token: "new-token",
    });
    expect(store.getState().profile.isUpdated).toBe(true);
  });
});
