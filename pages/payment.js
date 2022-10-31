import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContextState } from "../context/StateProvider";
import { CheckoutWizard, Layout } from "../components";

export default function Payment() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");

  const { state, stateDispatch } = useContextState();

  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    } else {
      setPaymentMethod(Cookies.get("paymentMethod") || "");
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();

    e.preventDefault();

    if (!paymentMethod) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
    } else {
      stateDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });

      Cookies.set("paymentMethod", JSON.stringify(paymentMethod), {
        sameSite: "strict",
      });

      router.push("/placeorder");
    }
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form
        onSubmit={submitHandler}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <Typography align="center" component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                />

                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
