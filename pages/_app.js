/* eslint-disable react/jsx-boolean-value */
import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import { SnackbarProvider } from "notistack";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { createEmotionCache, lightTheme } from "../utils";

import { StateContextProvider } from "../context/StateProvider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <StateContextProvider>
          <ThemeProvider theme={lightTheme}>
            <PayPalScriptProvider deferLoading={true}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Component {...pageProps} />
            </PayPalScriptProvider>
          </ThemeProvider>
        </StateContextProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
}
