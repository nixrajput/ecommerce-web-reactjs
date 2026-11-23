import { describe, expect, it, vi } from "vitest";
import apiClient from "../../api/apiClient";
import {
  NEW_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
} from "../constants/productConstants";
import { createProduct, updateProduct } from "./productAction";

vi.mock("../../api/apiClient", () => ({
  default: { post: vi.fn(), put: vi.fn() },
}));

const auth = { headers: { Authorization: "Bearer admin-token" } };

describe("product write actions", () => {
  it("createProduct sends JSON and accepts the 201 the API returns", async () => {
    const response = { status: 201, success: true, result: { _id: "p1" } };
    apiClient.post.mockResolvedValue(response);
    const dispatch = vi.fn();
    const product = new FormData();

    await createProduct(product, "admin-token")(dispatch);

    expect(apiClient.post).toHaveBeenCalledWith("/admin/product/create", product, auth);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: NEW_PRODUCT_SUCCESS,
      payload: response,
    });
  });

  it("updateProduct sends JSON", async () => {
    apiClient.put.mockResolvedValue({ status: 200, success: true });
    const dispatch = vi.fn();
    const product = new FormData();

    await updateProduct("p1", product, "admin-token")(dispatch);

    expect(apiClient.put).toHaveBeenCalledWith("/admin/product/p1", product, auth);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: true,
    });
  });
});
