import React from "react";
import {
  Button,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import axios from "axios";
import { useContextState } from "../../context/StateProvider";

export const CartItemsTable = ({ cartItems }) => {
  const { stateDispatch } = useContextState();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      // eslint-disable-next-line no-alert
      window.alert("Sorry. Product is out of stock");
      return;
    }
    stateDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    stateDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Action</TableCell>
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
                <Select
                  size="small"
                  onChange={(e) => updateCartHandler(item, e.target.value)}
                  value={item.quantity}
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <MenuItem key={x + 1} value={x + 1}>
                      {x + 1}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="right">₹{item.price}</TableCell>
              <TableCell align="right">
                <Button
                  color="secondary"
                  onClick={() => removeItemHandler(item)}
                  variant="contained"
                >
                  x
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
