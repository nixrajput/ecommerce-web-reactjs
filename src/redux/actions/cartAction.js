import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAIL,
  SAVE_SHIPPING_INFO_REQUEST,
  SAVE_SHIPPING_INFO_SUCCESS,
  SAVE_SHIPPING_INFO_FAIL,
  CLEAR_ERRORS
} from "../constants/cartConstants";
import apiClient from "../../api/apiClient";

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!getState) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: 'getState is undefined'
    });
    return;
  }

  if (!id) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: 'Id is required'
    });
    return;
  }

  if (!quantity) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: 'Quantity is required'
    });
    return;
  }

  dispatch({ type: ADD_TO_CART_REQUEST });

  try {
    const response = await apiClient.get(`/product/${id}`);

    if (response.status === 200) {
      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: {
          product: response.result._id,
          name: response.result.name,
          price: response.result.price,
          image: response.result.images[0].url,
          stock: response.result.stock,
          quantity: quantity,
        },
      });

      localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    }
    else {
      dispatch({
        type: ADD_TO_CART_FAIL,
        payload: response.message || 'An error occurred while fetching product details',
      });
    }
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: error.message || error || 'An error occurred while adding product to cart',
    });
  }
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!getState) {
    dispatch({
      type: REMOVE_CART_ITEM_FAIL,
      payload: 'getState is undefined'
    });
    return;
  }

  if (!id) {
    dispatch({
      type: REMOVE_CART_ITEM_FAIL,
      payload: 'Id is required'
    });
    return;
  }

  dispatch({ type: REMOVE_CART_ITEM_REQUEST });

  try {
    dispatch({
      type: REMOVE_CART_ITEM_SUCCESS,
      payload: id,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  }
  catch (error) {
    dispatch({
      type: REMOVE_CART_ITEM_FAIL,
      payload: error.message || error || 'An error occurred while removing item from cart',
    });
  }
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!data) {
    dispatch({
      type: SAVE_SHIPPING_INFO_FAIL,
      payload: 'Data is required'
    });
    return;
  }

  dispatch({ type: SAVE_SHIPPING_INFO_REQUEST });

  try {
    dispatch({
      type: SAVE_SHIPPING_INFO_SUCCESS,
      payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
  }
  catch (error) {
    dispatch({
      type: SAVE_SHIPPING_INFO_FAIL,
      payload: error.message || error || 'An error occurred while removing item from cart',
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};