import { createContext, useContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

const initialState = {
  // eslint-disable-next-line no-unneeded-ternary
  darkMode: Cookies.get("darkMode") === "ON" ? true : false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF":
      return { ...state, darkMode: false };
    default:
      return state;
  }
};

export const ThemeContextProvider = ({ children }) => {
  const [state, themeDispatch] = useReducer(reducer, initialState);
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = { state, themeDispatch };

  useEffect(() => {
    if (Cookies.get("darkMode") === "ON") {
      themeDispatch({ type: "DARK_MODE_ON" });
    }

    if (Cookies.get("darkMode") === "OFF") {
      themeDispatch({ type: "DARK_MODE_OFF" });
    }
  }, []);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
