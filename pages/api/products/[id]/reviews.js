/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
// /api/products/:id/reviews
import nextConnect from "next-connect";
import Product from "../../../../model/product";
import Reviews from "../../../../model/reviews";
import { db, onError, isAuth } from "../../../../utils";

const handler = nextConnect({
  onError,
});

handler.get(async (req, res) => {
  db.connect();

  console.log(req.query.id);

  const product = await Product.findById(req.query.id).populate("reviews");

  db.disconnect();

  if (product) {
    res.send(product.reviews);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

handler.use(isAuth).post(async (req, res) => {
  await db.connect();

  console.log(req.query.id);

  const product = await Product.findById(req.query.id).populate("reviews");

  console.log(product);

  if (product) {
    const existReview = product.reviews.find((x) => x.user == req.user._id);

    if (existReview) {
      await Product.updateOne(
        { _id: req.query.id, "reviews._id": existReview._id },
        {
          $set: {
            "reviews.$.comment": req.body.comment,
            "reviews.$.rating": Number(req.body.rating),
          },
        },
      );

      const updatedProduct = await Product.findById(req.query.id);

      updatedProduct.numReviews = updatedProduct.reviews.length;

      updatedProduct.rating =
        updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
        updatedProduct.reviews.length;

      await updatedProduct.save();

      await db.disconnect();
      return res.send({ message: "Review updated" });
    } else {
      console.log(Number(req.body.rating));

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };

      const newReview = new Reviews(review);

      console.log(newReview);

      await newReview.save();

      product.reviews.push(newReview._id);

      product.numReviews = product.reviews.length;

      if (product.reviews.length > 1) {
        product.rating =
          product.reviews.reduce((a, c) => c.rating + a, 0) /
          product.reviews.length;
      }

      await product.save();

      await db.disconnect();

      res.status(201).send({
        message: "Review submitted",
      });
    }
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default handler;
