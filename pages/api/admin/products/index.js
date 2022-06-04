import nc from "next-connect";
import Product from "../../../../model/product";
import { db, isAdmin, isAuth, onError } from "../../../../utils";

const handler = nc({
  onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample name",
    // eslint-disable-next-line prefer-template
    slug: "sample-slug-" + Math.random(),
    image: "/images/shirt1.jpg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    description: "sample description",
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product Created", product });
});

export default handler;
