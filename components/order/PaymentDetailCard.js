/* eslint-disable no-shadow */
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";
import { useContextState } from "../../context/StateProvider";
import { getError } from "../../utils";

export const PaymentDetailCard = ({
  order,
  orderDispatch,
  loadingDeliver,
  isPending,
}) => {
  const { itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid } = order;

  const { enqueueSnackbar } = useSnackbar();

  const { state } = useContextState();

  const { userInfo } = state;

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        orderDispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          },
        );

        orderDispatch({ type: "PAY_SUCCESS", payload: data });

        enqueueSnackbar("Order is paid", { variant: "success" });
      } catch (err) {
        orderDispatch({ type: "PAY_FAIL", payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    });
  };

  const onError = (err) => {
    enqueueSnackbar(getError(err), { variant: "error" });
  };

  const deliverOrderHandler = async () => {
    try {
      orderDispatch({ type: "DELIVER_REQUEST" });

      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        },
      );

      orderDispatch({ type: "DELIVER_SUCCESS", payload: data });

      enqueueSnackbar("Order is delivered", { variant: "success" });
    } catch (err) {
      orderDispatch({ type: "DELIVER_FAIL", payload: getError(err) });

      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <Grid item md={3} xs={12}>
      <Card sx={{ marginTop: 10, marginBottom: 10 }}>
        <List>
          <ListItem>
            <Typography fontWeight={500} variant="h2">
              Order Summary
            </Typography>
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

          {!isPaid && (
            <ListItem>
              {isPending ? (
                <CircularProgress />
              ) : (
                <div style={{ width: "100%" }}>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </div>
              )}
            </ListItem>
          )}

          {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <ListItem>
              {loadingDeliver && <CircularProgress />}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={deliverOrderHandler}
              >
                Deliver Order
              </Button>
            </ListItem>
          )}
        </List>
      </Card>
    </Grid>
  );
};
