import React from "react";
import dynamic from "next/dynamic";

import { Grid, Typography } from "@mui/material";

import {
  CheckoutWizard,
  Layout,
  OrderSummary,
  PlaceOrderCard,
} from "../components";

function PlaceOrder() {
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />

      <Typography align="center" component="h1" variant="h1">
        Place Order
      </Typography>

      <Grid container spacing={6}>
        <OrderSummary />
        <PlaceOrderCard />
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
