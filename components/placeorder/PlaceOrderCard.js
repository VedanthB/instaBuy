import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useContextState } from "../../context/StateProvider";
import { getError } from "../../utils";

export const PlaceOrderCard = () => {
  const router = useRouter();

  const { state, stateDispatch } = useContextState();

  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0),
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;

  const taxPrice = round2(itemsPrice * 0.15);

  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }

    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, []);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      stateDispatch({ type: "CART_CLEAR" });

      Cookies.remove("cartItems");

      setLoading(false);

      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Grid item md={3} xs={12}>
      <Card sx={{ marginTop: 10, marginBottom: 10 }}>
        <List>
          <ListItem>
            <Typography variant="h2">Order Summary</Typography>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={6}>
                <Typography>Items:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{itemsPrice}</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={6}>
                <Typography>Tax:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxPrice}</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={6}>
                <Typography>Shipping:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{shippingPrice}</Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={6}>
                <Typography>
                  <strong>Total:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  <strong>₹{totalPrice}</strong>
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Button
              onClick={placeOrderHandler}
              variant="contained"
              color="primary"
              fullWidth
            >
              Place Order
            </Button>
          </ListItem>
          {loading && (
            <ListItem>
              <CircularProgress />
            </ListItem>
          )}
        </List>
      </Card>
    </Grid>
  );
};
