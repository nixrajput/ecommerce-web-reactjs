import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios, { AxiosError } from "axios";
import apiClient from "./apiClient";

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: Object.assign(vi.fn(), { isAxiosError: actual.isAxiosError }),
  };
});

describe("apiClient", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_BASE_API_URL", "https://api.example");
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("reports a network error that has no response", async () => {
    axios.mockRejectedValue(
      new AxiosError("Network Error", AxiosError.ERR_NETWORK)
    );

    await expect(apiClient.get("/products")).rejects.toThrow(
      "Cannot reach the server. Check your connection and try again."
    );
  });

  it("keeps the message the server sends", async () => {
    axios.mockRejectedValue(
      new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
        status: 400,
        data: { message: "Invalid product" },
      })
    );

    await expect(apiClient.get("/products")).rejects.toThrow("Invalid product");
  });

  it("falls back to the error message when the response has no body", async () => {
    axios.mockRejectedValue(
      new AxiosError("Request failed with status code 502", "ERR_BAD_RESPONSE", undefined, undefined, {
        status: 502,
      })
    );

    await expect(apiClient.get("/products")).rejects.toThrow(
      "Request failed with status code 502"
    );
  });
});
