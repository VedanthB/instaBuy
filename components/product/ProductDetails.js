import {
  Grid,
  List,
  ListItem,
  Rating,
  Typography,
  Link,
  Button,
  Card,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useContextState } from "../../context/StateProvider";

export const ProductDetails = ({ product }) => {
  const { state, stateDispatch } = useContextState();

  const router = useRouter();

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      // eslint-disable-next-line no-alert
      window.alert("Sorry. Product is out of stock");
      return;
    }

    stateDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });

    router.push("/cart");
  };

  return (
    <Grid container spacing={1}>
      <Grid item md={6} xs={12}>
        <Image
          src={product.image}
          alt={product.name}
          width={640}
          height={640}
          layout="responsive"
        />
      </Grid>

      <Grid item md={3} xs={12}>
        <List>
          <ListItem>
            <Typography component="h1" variant="h1">
              {product.name}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>Category: {product.category}</Typography>
          </ListItem>
          <ListItem>
            <Typography>Brand: {product.brand}</Typography>
          </ListItem>
          <ListItem>
            <Rating value={parseInt(product.rating, 10)} readOnly />
            <Link href="#reviews">
              <Typography>({product.numReviews} reviews)</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Typography> Description: {product.description}</Typography>
          </ListItem>
        </List>
      </Grid>

      <Grid item md={3} xs={12}>
        <Card>
          <List>
            <ListItem>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Price</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>₹{product.price}</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Status</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    {product.countInStock > 0 ? "In stock" : "Unavailable"}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={addToCartHandler}
              >
                Add to cart
              </Button>
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
};
