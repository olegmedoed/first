import jwt from "jsonwebtoken";
import only from "only";

import { PEACE, READY, FIGHT } from "../models/user";

const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const USER_READY = "USER_READY";
const USER_UPDATE = "USER_UPDATE";
const START_FIGHT = "START_FIGHT";
const END_OF_FIGHT = "END_OF_FIGHT";
const SEND_MESSAGE = "SEND_MESSAGE";
const ADD_MESSAGE = "ADD_MESSAGE";
const TURN = "TURN";
const ACQUIRE_TURN = "ACQUIRE_TURN";

const ME = "ME";
const OPPONENT = "OPPONENT";

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on("disconnect", async () => {
    const user = await User.findOneAndUpdate(
      { socket_id: ws.id },
      { socket_id: null, status: PEACE, game: null }
    );

    if (ws.opponent_id) {
      const opponent = await User.findOneAndUpdate(
        { socket_id: ws.opponent_id },
        { socket_id: null, status: PEACE, game: null }
      );
      ws.to(ws.opponent_id).emit(END_OF_FIGHT);
    }

    if (user) {
      logger.debug(`${user.name}(id: ${ws.id}) goes`);
      ws.broadcast.emit(OPPONENT_GOES, user.name);
    }
  });

  ws.on(OPPONENTS_LOAD, cb => {
    User.find({ socket_id: { $ne: null } })
      .then(users => {
        const data = users.map(({ name, status }) => ({ name, status }));
        cb({ data });
        logger.debug("load opponents");
      })
      .catch(err => {
        logger.debug("can't load users: " + err.message);
        cb({ error: { message: err.message } });
      });
  });

  ws.on(USER_READY, async () => {
    const opponent = await User.getOpponent(ws.user);

    if (!opponent) {
      const { name, status } = await ws.user.availableForFight();
      logger.debug(`user "${name}" ready to fight`);
      ws.broadcast.emit(OPPONENT_UPSERT, { name, status });
      ws.emit(USER_UPDATE, { status });
      return;
    }

    ws.opponent_id = opponent.socket_id;
    ws.nsp.connected[opponent.socket_id].opponent_id = ws.id;

    await ws.user.readyToFight();

    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(ws.user, "name status"));

    logger.debug(
      `${ws.user.name}(${ws.id}) fights with ${opponent.name}(${
        opponent.socket_id
      })`
    );

    //await ws.user.startGame(opponent);

    ws.emit(START_FIGHT, {
      turn: true,
      [ME]: { name: ws.user.name },
      [OPPONENT]: { name: opponent.name }
    });
    ws.to(opponent.socket_id).emit(START_FIGHT, {
      turn: false,
      [ME]: { name: opponent.name },
      [OPPONENT]: { name: ws.user.name }
    });
  });

  ws.on(SEND_MESSAGE, data => {
    if (!ws.opponent_id) return;
    ws.to(ws.opponent_id).emit(ADD_MESSAGE, data);
  });

  ws.on(TURN, data => {
    const { me, opponent } = data;
    ws
      .to(ws.opponent_id)
      .emit(ACQUIRE_TURN, { [ME]: opponent, [OPPONENT]: me });
  });
}
