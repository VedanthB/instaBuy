import { createContext, useContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

const StateContext = createContext();

const initialState = {
  // eslint-disable-next-line no-unneeded-ternary
  darkMode: Cookies.get("darkMode") === "ON" ? true : false,
  cart: {
    cartItems: Cookies.get("cartItems")
      ? JSON.parse(Cookies.get("cartItems"))
      : [],
  },
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

      Cookies.set("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id,
      );

      Cookies.set("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
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
  }, []);

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useContextState = () => useContext(StateContext);
