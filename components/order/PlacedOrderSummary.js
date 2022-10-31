import React from "react";
import {
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";

export const PlacedOrderSummary = ({ order }) => {
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Grid item md={9} xs={12}>
      {/* Shipping details */}
      <Card sx={{ marginTop: 5, marginBottom: 5 }}>
        <List>
          <ListItem>
            <Typography fontWeight={500} component="h2" variant="h2">
              Shipping Address
            </Typography>
          </ListItem>

          <ListItem>
            {shippingAddress.fullName}, {shippingAddress.address},{" "}
            {shippingAddress.city}, {shippingAddress.postalCode},{" "}
            {shippingAddress.country}
          </ListItem>

          <ListItem>
            Status:{" "}
            {isDelivered
              ? `Delivered at ${formatDate(deliveredAt)}`
              : "Not Delivered"}
          </ListItem>
        </List>
      </Card>

      {/* Payment details */}
      <Card sx={{ marginTop: 5, marginBottom: 5 }}>
        <List>
          <ListItem>
            <Typography fontWeight={500} component="h2" variant="h2">
              Payment Method
            </Typography>
          </ListItem>
          <ListItem>{paymentMethod}</ListItem>
          <ListItem>
            Status: {isPaid ? `Paid at ${formatDate(paidAt)}` : "Not Paid"}
          </ListItem>
        </List>
      </Card>

      {/* Order items details */}
      <Card sx={{ marginTop: 5, marginBottom: 5 }}>
        <List>
          <ListItem>
            <Typography fontWeight={500} component="h2" variant="h2">
              Order Items
            </Typography>
          </ListItem>

          <ListItem>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>{item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>₹{item.price}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ListItem>
        </List>
      </Card>
    </Grid>
  );
};
