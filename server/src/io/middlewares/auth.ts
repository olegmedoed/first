import * as jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const ESCAPE_AUTH = ["OPPONENTS_LIST"];

export default function authIO({ logger, models }) {
  const User = models.model("User");

  return async (ws, next) => {
    try {
      const { id, handshake } = ws;
      const { name } = jwt.verify(handshake.query.token, JWT_SECRET);
      const user = await User.findOneAndUpdate(
        { name },
        { socket_id: id },
        { new: true }
      );
      logger.debug(
        `io:auth - authenticate new conn(${ws.nsp.name}). User "${
          user.name
        }"-"${id} aka ${user.socket_id}" is coming`
      );
      ws.user = user;
      ws.use(async ([event_name], next) => {
        if (ESCAPE_AUTH.includes(event_name)) return next();
        try {
          ws.user = await User.findOne({ name, socket_id: id });
          logger.debug(`io:ws:auth - user("${name}") is authenticated`);
          next();
        } catch (err) {
          next(err);
        }
      });
      next();
    } catch (err) {
      logger.error(`io:auth fail to authenticate new connection: ${err.stack}`);
      next(err);
    }
  };
}