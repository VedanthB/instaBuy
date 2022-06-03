import { createContext, useContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

const StateContext = createContext();

const initialState = {
  // eslint-disable-next-line no-unneeded-ternary
  darkMode: false,
  cart: {
    cartItems: [],
    shippingAddress: {},
  },
  userInfo: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };

    case "DARK_MODE_OFF":
      return { ...state, darkMode: false };

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
      return { ...state, userInfo: null, cart: { cartItems: [] } };

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

    default:
      return state;
  }
};

export const StateContextProvider = ({ children }) => {
  const [state, stateDispatch] = useReducer(reducer, initialState);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = { state, stateDispatch };

  useEffect(() => {
    if (Cookies.get("darkMode") === "ON") {
      stateDispatch({ type: "DARK_MODE_ON" });
    }

    if (Cookies.get("darkMode") === "OFF") {
      stateDispatch({ type: "DARK_MODE_OFF" });
    }

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
  }, []);

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useContextState = () => useContext(StateContext);
