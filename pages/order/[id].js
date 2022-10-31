/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useReducer } from "react";
import dynamic from "next/dynamic";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import {
  Layout,
  PaymentDetailCard,
  PlacedOrderSummary,
} from "../../components";
import { useContextState } from "../../context/StateProvider";
import { orderReducer } from "../../reducers";

const initialOrderState = {
  loading: true,
  order: {},
  error: "",
};

function Order({ params }) {
  const orderId = params.id;

  const router = useRouter();

  const [{ isPending }, paypalorderDispatch] = usePayPalScriptReducer();

  const { state } = useContextState();

  const { userInfo } = state;

  const [
    { loading, error, order, successPay, loadingDeliver, successDeliver },
    orderDispatch,
  ] = useReducer(orderReducer, initialOrderState);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }

    const fetchOrder = async () => {
      try {
        orderDispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        orderDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        orderDispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();

      if (successPay) {
        orderDispatch({ type: "PAY_RESET" });
      }

      if (successDeliver) {
        orderDispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        paypalorderDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });

        paypalorderDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography sx={{ color: "#f04040" }}>{error}</Typography>
      ) : (
        <Grid container spacing={6}>
          <PlacedOrderSummary order={order} />
          <PaymentDetailCard
            order={order}
            orderDispatch={orderDispatch}
            loadingDeliver={loadingDeliver}
            isPending={isPending}
          />
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
