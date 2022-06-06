import nc from "next-connect";
import Order from "../../../../model/order";
import { db, isAuth, onError } from "../../../../utils";

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({ message: "order delivered", order: deliveredOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "order not found" });
  }
});

export default handler;
