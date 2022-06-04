import { useRouter } from "next/router";
import axios from "axios";
import { Grid } from "@mui/material";
import { Layout, ProductItem } from "../components";
import { db } from "../utils";
import Product from "../model/product";
import { useContextState } from "../context/StateProvider";

export default function Home({ products }) {
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
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find({}, "-reviews").lean();

  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
