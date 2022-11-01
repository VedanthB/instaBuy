import { createContext, useContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

const StateContext = createContext();

const initialState = {
  cart: {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: "",
  },
  userInfo: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "CART_ADD_ITEM": {
      const newItem = payload;

      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id,
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item,
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set("cartItems", JSON.stringify(cartItems), {
        sameSite: "strict",
      });

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "GET_CART_ITEM":
      return { ...state, cart: { ...state.cart, cartItems: payload } };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== payload._id,
      );

      Cookies.set("cartItems", JSON.stringify(cartItems), {
        sameSite: "strict",
      });

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "USER_LOGIN":
      return { ...state, userInfo: payload };

    case "USER_LOGOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: payload },
      };

    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    default:
      return state;
  }
};

export const StateContextProvider = ({ children }) => {
  const [state, stateDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      stateDispatch({
        type: "USER_LOGIN",
        payload: JSON.parse(Cookies.get("userInfo")),
      });
    }

    if (Cookies.get("cartItems")) {
      stateDispatch({
        type: "GET_CART_ITEM",
        payload: JSON.parse(Cookies.get("cartItems")),
      });
    }

    if (Cookies.get("shippingAddress")) {
      stateDispatch({
        type: "SAVE_SHIPPING_ADDRESS",
        payload: JSON.parse(Cookies.get("shippingAddress")),
      });
    }

    if (Cookies.get("paymentMethod")) {
      stateDispatch({
        type: "SAVE_PAYMENT_METHOD",
        payload: JSON.parse(Cookies.get("paymentMethod")),
      });
    }
  }, []);

  return (
    <StateContext.Provider value={{ state, stateDispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useContextState = () => useContext(StateContext);
