import apiClient from "../../api/apiClient";
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

// Create Order
export const createOrder = (order, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!order) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: 'Order data is required',
    });
    return;
  }

  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await apiClient.post(`/order/new`, order, options);

    if (response.status === 200) {
      dispatch({
        type: CREATE_ORDER_SUCCESS,
        payload: response.result,
      });
    }
    else {
      dispatch({
        type: CREATE_ORDER_FAIL,
        payload: response.message || 'An error occurred while creating new order',
      });
    }
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.message || error,
    });
  }
};

// My Orders
export const myOrders = (token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  dispatch({ type: MY_ORDERS_REQUEST });

  try {
    const options = {};

    options.headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await apiClient.get(`/orders/me`, options);

    if (response.status === 200) {
      dispatch({
        type: MY_ORDERS_SUCCESS,
        payload: response.results,
      });
    }
    else {
      dispatch({
        type: MY_ORDERS_FAIL,
        payload: response.message || 'An error occurred while fetching my orders',
      });
    }
  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: error.message || error,
    });
  }
};

// Get All Orders (admin)
export const getAllOrders = (token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  dispatch({ type: ALL_ORDERS_REQUEST });

  try {
    const options = {};

    options.headers = { 'Authorization': `Bearer ${token}` };

    const response = await apiClient.get(`/admin/orders`, options);

    if (response.status === 200) {
      dispatch({
        type: ALL_ORDERS_SUCCESS,
        payload: response.results,
      });
    }
    else {
      dispatch({
        type: ALL_ORDERS_FAIL,
        payload: response.message || 'An error occurred while fetching products',
      });
    }
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Order
export const updateOrder = (id, order, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!order) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: 'Order data is required',
    });
    return;
  }

  if (!id) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: 'Order id is required',
    });
    return;
  }

  dispatch({ type: UPDATE_ORDER_REQUEST });

  try {
    const options = {};

    options.headers = { 'Authorization': `Bearer ${token}` };

    const response = await apiClient.put(`/admin/order/${id}`, order, options);

    if (response.status === 200) {
      dispatch({
        type: UPDATE_ORDER_SUCCESS,
        payload: response.success,
      });
    }
    else {
      dispatch({
        type: UPDATE_ORDER_FAIL,
        payload: response.message || 'An error occurred while updating order',
      });
    }
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.message || error,
    });
  }
};

// Delete Order
export const deleteOrder = (id, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!id) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: 'Order id is required',
    });
    return;
  }

  dispatch({ type: DELETE_ORDER_REQUEST });

  try {
    const options = {};

    options.headers = { 'Authorization': `Bearer ${token}` };

    const response = await apiClient.delete(`/admin/order/${id}`, options);

    if (response.status === 200) {
      dispatch({
        type: DELETE_ORDER_SUCCESS,
        payload: response.success,
      });
    }
    else {
      dispatch({
        type: DELETE_ORDER_FAIL,
        payload: response.message || 'An error occurred while deleting order',
      });
    }
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.message || error,
    });
  }
};

// Get Order Details
export const getOrderDetails = (id, token) => async (dispatch) => {
  if (!dispatch) {
    console.log('dispatch is undefined');
    return;
  }

  if (!token) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: 'Token is required',
    });
    return;
  }

  if (!id) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: 'Order id is required',
    });
    return;
  }

  dispatch({ type: ORDER_DETAILS_REQUEST });

  try {
    const options = {};

    options.headers = { 'Authorization': `Bearer ${token}` };

    const response = await apiClient.get(`/order/${id}`, options);

    if (response.status === 200) {
      dispatch({
        type: ORDER_DETAILS_SUCCESS,
        payload: response.result,
      });
    }
    else {
      dispatch({
        type: ORDER_DETAILS_FAIL,
        payload: response.message || 'An error occurred while fetching order details',
      });
    }
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.message || error,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
