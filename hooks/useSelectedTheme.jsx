import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { darkTheme, lightTheme } from "../utils";

const useSelectedTheme = () => {
  const [selectedTheme, setSelectedTheme] = useState(lightTheme);

  useEffect(() => {
    setSelectedTheme(Cookies.get("darkMode") === "ON" ? darkTheme : lightTheme);
    // console.log("theme", selectedTheme);
  }, [selectedTheme]);
  return { selectedTheme, setSelectedTheme };
};

export default useSelectedTheme;
