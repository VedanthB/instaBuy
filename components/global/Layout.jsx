import Head from "next/head";
import React from "react";
import NextLink from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Link,
  IconButton,
} from "@mui/material";

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
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "1024px",
            margin: "auto",
            width: "100%",
          }}
        >
          <NextLink href="/" passHref>
            <Link>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                instaBuy
              </Typography>
            </Link>
          </NextLink>
          <div sx={{ flexGrow: "1" }} />
          <div>
            <NextLink href="/cart" passHref>
              <IconButton color="primary" aria-label="cart">
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </NextLink>
            <NextLink href="/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </div>
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
