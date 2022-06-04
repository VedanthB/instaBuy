import nc from "next-connect";
import Product from "../../../model/product";
import { db } from "../../../utils";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const categories = await Product.find().distinct("category");
  await db.disconnect();
  res.send(categories);
});

export default handler;
