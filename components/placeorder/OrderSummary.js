import React from "react";
import {
  Card,
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useContextState } from "../../context/StateProvider";

export const OrderSummary = () => {
  const { state } = useContextState();

  const {
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;

  return (
    <Grid item md={9} xs={12}>
      {/* shipping details */}
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
        </List>
      </Card>

      {/* payment details */}

      <Card sx={{ marginTop: 5, marginBottom: 5 }}>
        <List>
          <ListItem>
            <Typography fontWeight={500} component="h2" variant="h2">
              Payment Method
            </Typography>
          </ListItem>
          <ListItem>{paymentMethod}</ListItem>
        </List>
      </Card>

      {/* order items details */}

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
                  {cartItems.map((item) => (
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
