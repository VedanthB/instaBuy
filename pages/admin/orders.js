/* eslint-disable no-nested-ternary */
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useReducer } from "react";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContextState } from "../../context/StateProvider";
import { formatDate, getError } from "../../utils";
import { Layout } from "../../components";
import { adminOrderReducer } from "../../reducers";

const adminOrderInitState = {
  loading: true,
  orders: [],
  error: "",
};

function AdminOrders() {
  const { state } = useContextState();

  const router = useRouter();

  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(
    adminOrderReducer,
    adminOrderInitState,
  );

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Orders">
      <Grid container spacing={6}>
        <Grid item md={3} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card sx={{ marginTop: 10, marginBottom: 10 }}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Orders
                </Typography>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={{ color: "#f04040" }}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>
                              {order.user ? order.user.name : "DELETED USER"}
                            </TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${formatDate(order.paidAt)}`
                                : "not paid"}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${formatDate(
                                    order.deliveredAt,
                                  )}`
                                : "not delivered"}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
