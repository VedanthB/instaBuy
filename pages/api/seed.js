import nc from "next-connect";

// import Product from "../../model/product";
// import User from "../../model/user";
// import { data, db } from "../../utils";

const handler = nc();

handler.get(async (req, res) => {
  // await db.connect();
  // await User.deleteMany();
  // await User.insertMany(data.users);
  // await Product.deleteMany();
  // await Product.insertMany(data.products);
  // await db.disconnect();
  res.send({ message: "seeded successfully" });
});

export default handler;
