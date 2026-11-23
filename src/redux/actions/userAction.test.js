import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../api/apiClient";
import store from "../store";
import {
  LOGIN_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_USER_SUCCESS,
} from "../constants/userConstants";
import {
  loadUser,
  logout,
  updatePassword,
  updateProfile,
  updateUser,
} from "./userAction";

vi.mock("../../api/apiClient", () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

let storage;

beforeEach(() => {
  storage = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("updatePassword", () => {
  it("stores the new token the API returns", async () => {
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

describe("loadUser", () => {
  it("keeps the user signed in after a page reload", async () => {
    storage.set("token", "stored-token");
    // GET /user/me returns the user without a token.
    apiClient.get.mockResolvedValue({
      status: 200,
      success: true,
      result: { name: "Test" },
    });

    await store.dispatch(loadUser(localStorage.getItem("token")));

    expect(apiClient.get).toHaveBeenCalledWith("/user/me", {
      headers: { Authorization: "Bearer stored-token" },
    });
    expect(store.getState().user).toMatchObject({
      isAuthenticated: true,
      user: { name: "Test" },
      token: "stored-token",
    });
    expect(localStorage.getItem("token")).toBe("stored-token");
  });
});

describe("logout", () => {
  it.each([
    ["the API revokes the token", () => apiClient.get.mockResolvedValue({ status: 200 })],
    ["the API call fails", () => apiClient.get.mockRejectedValue(new Error("down"))],
  ])("sends the token and clears the session when %s", async (_, mockApi) => {
    mockApi();
    storage.set("token", "user-token");
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: { name: "Test" }, token: "user-token" },
    });

    await store.dispatch(logout("user-token"));

    expect(apiClient.get).toHaveBeenCalledWith("/logout", {
      headers: { Authorization: "Bearer user-token" },
    });
    expect(localStorage.getItem("token")).toBeNull();
    expect(store.getState().user).toMatchObject({
      isAuthenticated: false,
      token: null,
    });
  });
});

describe("profile write actions", () => {
  const auth = { headers: { Authorization: "Bearer user-token" } };

  it("updateProfile sends JSON", async () => {
    apiClient.put.mockResolvedValue({ status: 200, success: true });
    const dispatch = vi.fn();
    const profile = new FormData();

    await updateProfile(profile, "user-token")(dispatch);

    expect(apiClient.put).toHaveBeenCalledWith("/user/me/update", profile, auth);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: UPDATE_PROFILE_SUCCESS,
      payload: true,
    });
  });

  it("updateUser sends JSON", async () => {
    apiClient.put.mockResolvedValue({ status: 200, success: true });
    const dispatch = vi.fn();
    const user = new FormData();

    await updateUser("u1", user, "user-token")(dispatch);

    expect(apiClient.put).toHaveBeenCalledWith("/admin/user/u1", user, auth);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: UPDATE_USER_SUCCESS,
      payload: true,
    });
  });
});
