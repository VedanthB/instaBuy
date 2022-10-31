/* eslint-disable no-unused-vars */
/* eslint-disable radix */
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Layout, ProductDetails, ProductReviews } from "../../components";
import { db, getError } from "../../utils";
import Product from "../../model/product";
import { useContextState } from "../../context/StateProvider";

export default function ProductScreen({ product }) {
  const router = useRouter();

  if (!product) {
    return <div>Product Not Found</div>;
  }

  return (
    <Layout title={product.name} description={product.description}>
      <div sx={{ marginTop: 10, marginBottom: 10 }}>
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
