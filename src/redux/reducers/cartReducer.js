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

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ADD_TO_CART_SUCCESS:
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        return {
          ...state,
          loading: false,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          loading: false,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    case SAVE_SHIPPING_INFO_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SAVE_SHIPPING_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        shippingInfo: action.payload,
      };

    case ADD_TO_CART_FAIL:
    case REMOVE_CART_ITEM_FAIL:
    case SAVE_SHIPPING_INFO_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
