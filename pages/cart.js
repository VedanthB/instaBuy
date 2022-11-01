import React from "react";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { Grid, Link, Typography } from "@mui/material";
import { CartItemsTable, CheckoutCard, Layout } from "../components";
import { useContextState } from "../context/StateProvider";

const CartScreen = () => {
  const { state } = useContextState();

  const {
    cart: { cartItems },
  } = state;

  return (
    <Layout title="Shopping Cart">
      <Typography
        align="center"
        sx={{ marginTop: "2rem", marginBottom: "4rem", fontSize: "2rem" }}
        component="h1"
        variant="h1"
      >
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography align="center">
          Cart is empty.
          <NextLink href="/" passHref>
            <Link>Go shopping</Link>
          </NextLink>
        </Typography>
      ) : (
        <Grid container spacing={6}>
          <Grid item md={9} xs={12}>
            <CartItemsTable cartItems={cartItems} />
          </Grid>
          <Grid item md={3} xs={12}>
            <CheckoutCard cartItems={cartItems} />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
