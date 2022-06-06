// import useStyles from "./styles";

// export { useStyles };

import data from "./data";
import createEmotionCache from "./createEmotionCache";
import { lightTheme, darkTheme } from "./theme";
import db from "./db";
import { signToken, isAuth, isAdmin } from "./auth";
import { getError, onError } from "./error";

export {
  data,
  createEmotionCache,
  lightTheme,
  darkTheme,
  db,
  signToken,
  getError,
  onError,
  isAuth,
  isAdmin,
};
