import nc from "next-connect";
import Order from "../../../../model/order";
import { db, isAuth } from "../../../../utils";

const handler = nc();

handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;
