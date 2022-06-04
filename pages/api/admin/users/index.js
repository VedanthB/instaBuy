import nc from "next-connect";
import User from "../../../../model/user";
import { db, isAdmin, isAuth } from "../../../../utils";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
