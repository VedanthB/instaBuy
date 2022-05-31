import Head from "next/head";
import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title> instaBuy </title>
      </Head>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#203040",
          "& a": {
            color: "#ffffff",
            marginLeft: 10,
          },
        }}
      >
        <Toolbar>
          <Typography> instaBuy </Typography>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          minHeight: "80vh",
        }}
      >
        {children}
      </Container>
      <footer sx={{ marginTop: 10, textAlign: "center" }}>
        <Typography> All rights reserved. instaBuy </Typography>
      </footer>
    </div>
  );
};

export default Layout;
