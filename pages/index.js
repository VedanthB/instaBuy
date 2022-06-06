/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import axios from "axios";
import NextLink from "next/link";
import Carousel from "react-material-ui-carousel";
import { Grid, Link, Typography } from "@mui/material";
import { Layout, ProductItem } from "../components";
import { db } from "../utils";
import Product from "../model/product";
import { useContextState } from "../context/StateProvider";

export default function Home({ topRatedProducts, featuredProducts }) {
  const router = useRouter();

  const { state, stateDispatch } = useContextState();

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      // eslint-disable-next-line no-alert
      window.alert("Sorry. Product is out of stock");
      return;
    }
    stateDispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout>
      <Carousel height="400px" sx={{ marginTop: "1rem" }} animation="slide">
        {featuredProducts.map((product) => (
          <NextLink
            key={product._id}
            href={`/product/${product.slug}`}
            passHref
          >
            <Link sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={product.featuredImage}
                alt={product.name}
                style={{ height: "400px" }}
                // className={classes.featuredImage}
              />
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();

  const featuredProductsDocs = await Product.find(
    { isFeatured: true },
    "-reviews",
  )
    .lean()
    .limit(3);
  const topRatedProductsDocs = await Product.find({}, "-reviews")
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);

  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}
