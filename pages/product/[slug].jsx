/* eslint-disable radix */
import React from "react";
import NextLink from "next/link";

import { Typography } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Layout, ProductDetails, ProductReviews } from "../../components";
import { db } from "../../utils";
import Product from "../../model/product";

export default function ProductScreen({ product }) {
  if (!product) {
    return <div>Product Not Found</div>;
  }

  return (
    <Layout title={product.name} description={product.description}>
      <div>
        <NextLink href="/" passHref>
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                textDecoration: "underline",
              },
              marginBottom: 10,
            }}
          >
            <ChevronLeftIcon sx={{ cursor: "pointer", fontSize: "2rem" }} />
            Back to Products
          </Typography>
        </NextLink>
      </div>

      <ProductDetails product={product} />

      <ProductReviews product={product} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();

  const product = await Product.findOne({ slug }, "-reviews").lean();

  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
