import apiClient from "../../api/apiClient";
import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

// Get All Products
export const getProducts =
  (
    keyword = "",
    currentPage = 1,
    minPrice = 0,
    maxPrice = 50000,
    category,
    ratings = 0
  ) =>
    async (dispatch) => {
      if (!dispatch) {
        console.log('dispatch is undefined');
        return;
      }

      dispatch({ type: ALL_PRODUCT_REQUEST });

      let link = `/products?keyword=${keyword}&page=${currentPage}&price[gte]=${minPrice}&price[lte]=${maxPrice}&ratings[gte]=${ratings}`;

      if (
        category &&
        category !== "All" &&
        category !== "all" &&
        category !== "ALL"
      ) {
        link = `/products?keyword=${keyword}&page=${currentPage}&price[gte]=${minPrice}&price[lte]=${maxPrice}&category=${category}&ratings[gte]=${ratings}`;
      }

      try {
        const response = await apiClient.get(link);

        if (response.status === 200) {
          dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: response,
          });
        }
        else {
          dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: response.message || 'An error occurred while fetching products',
          });
        }
      } catch (error) {
        dispatch({
          type: ALL_PRODUCT_FAIL,
          payload: error.message || error,
        });
      }
    };

// Get Products Details
export const getProductDetails = (id) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!id) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: 'Product ID is required',
    });
    return;
  }

  dispatch({ type: PRODUCT_DETAILS_REQUEST });

  try {
    const response = await apiClient.get(`/product/${id}`);

    if (response.status === 200) {
      dispatch({
        type: PRODUCT_DETAILS_SUCCESS,
        payload: response,
      });
    }
    else {
      dispatch({
        type: PRODUCT_DETAILS_FAIL,
        payload: response.message || 'An error occurred while fetching product details',
      });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.message || error,
    });
  }
};

// Get All Products For Admin
export const getAdminProduct = (token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  dispatch({ type: ADMIN_PRODUCT_REQUEST });

  try {
    const options = {};

    options.headers = { 'Authorization': `Bearer ${token}` };

    const response = await apiClient.get(`/admin/products`, options);

    if (response.status === 200) {
      dispatch({
        type: ADMIN_PRODUCT_SUCCESS,
        payload: response,
      });
    }
    else {
      dispatch({
        type: ADMIN_PRODUCT_FAIL,
        payload: response.message || 'An error occurred while fetching products',
      });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: error.message || error,
    });
  }
};

// Create Product
export const createProduct = (productData, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!productData) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: 'Product data is required',
    });
    return;
  }

  dispatch({ type: NEW_PRODUCT_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const response = await apiClient.post(`/admin/product/create`, productData, options);

    if (response.status === 200) {
      dispatch({
        type: NEW_PRODUCT_SUCCESS,
        payload: response,
      });
    }
    else {
      dispatch({
        type: NEW_PRODUCT_FAIL,
        payload: response.message || 'An error occurred while creating new product',
      });
    }
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.message || error,
    });
  }
};

// Update Product
export const updateProduct = (id, productData, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!id) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: 'Product ID is required',
    });
    return;
  }

  if (!token) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!productData) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: 'Product data is required',
    });
    return;
  }

  dispatch({ type: UPDATE_PRODUCT_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const response = await apiClient.put(`/admin/product/${id}`, productData, options);

    if (response.status === 200) {
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: response.success,
      });
    }
    else {
      dispatch({
        type: UPDATE_PRODUCT_FAIL,
        payload: response.message || 'An error occurred while updating product details',
      });
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.message || error,
    });
  }
};

// Delete Product
export const deleteProduct = (id, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!id) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: 'Product ID is required',
    });
    return;
  }

  if (!token) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  dispatch({ type: DELETE_PRODUCT_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await apiClient.delete(`/admin/product/${id}`, options);

    if (response.status === 200) {
      dispatch({
        type: DELETE_PRODUCT_SUCCESS,
        payload: response.success,
      });
    }
    else {
      dispatch({
        type: DELETE_PRODUCT_FAIL,
        payload: response.message || 'An error occurred while creating new product',
      });
    }
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.message || error,
    });
  }
};

// NEW REVIEW
export const newReview = (reviewData, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!reviewData) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: 'Review data is required',
    });
    return;
  }

  dispatch({ type: NEW_REVIEW_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await apiClient.put(`/review`, reviewData, options);

    if (response.status === 200) {
      dispatch({
        type: NEW_REVIEW_SUCCESS,
        payload: response.success,
      });
    }
    else {
      dispatch({
        type: NEW_REVIEW_FAIL,
        payload: response.message || 'An error occurred while creating a review',
      });
    }
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.message || error,
    });
  }
};

// Get All Reviews of a Product
export const getAllReviews = (id, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!id) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: 'Product ID is required',
    });
    return;
  }

  dispatch({ type: ALL_REVIEW_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await apiClient.get(`/reviews?id=${id}`, options);

    if (response.status === 200) {
      dispatch({
        type: ALL_REVIEW_SUCCESS,
        payload: response.results,
      });
    }
    else {
      dispatch({
        type: ALL_REVIEW_FAIL,
        payload: response.message || 'An error occurred while fetching reviews',
      });
    }
  } catch (error) {
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: error.message || error,
    });
  }
};

// Delete Review of a Product
export const deleteReviews = (reviewId, productId, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!productId) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: 'ProductId is required',
    });
    return;
  }

  if (!reviewId) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: 'ReviewId is required',
    });
    return;
  }

  dispatch({ type: DELETE_REVIEW_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await apiClient.delete(`/reviews?id=${reviewId}&productId=${productId}`, options);

    if (response.status === 200) {
      dispatch({
        type: DELETE_REVIEW_SUCCESS,
        payload: response.success,
      });
    }
    else {
      dispatch({
        type: DELETE_REVIEW_FAIL,
        payload: response.message || 'An error occurred while deleting review',
      });
    }
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.message || error,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
