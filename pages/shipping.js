import React from "react";

import { CheckoutWizard, Layout, ShippingAddress } from "../components";

export default function Shipping() {
  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />

      <ShippingAddress />
    </Layout>
  );
}
