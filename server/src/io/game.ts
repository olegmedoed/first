import only = require("only");

import BattleController from "./controllers/battle";
import UserController from "./controllers/user";
import ChatController from "./controllers/chat";

export const USER_GOES = "USER_GOES";
export const GET_USERS = "GET_USERS";
export const USERS_UPSERT = "USERS_UPSERT";
export const BATTLE_REQUEST = "BATTLE_REQUEST";
export const BATTLE_UPDATE = "BATTLE_UPDATE";
export const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const TURN = "TURN";
export const ADD_UNIT = "ADD_UNIT";
export const ATTACK = "ATTACK";

export default function(ws, opts) {
  const { logger } = opts;
  const battleController = new BattleController(ws, opts);
  const userController = new UserController(ws, opts);
  const chatController = new ChatController(ws, opts);

  ws.on("disconnect", onDisconnect);

  ws.on(GET_USERS, userController.getOnlineUsers);
  ws.on(SEND_MESSAGE, chatController.sendMessage);

  ws.on(BATTLE_REQUEST, battleController.tryCreateBattle);
  ws.on(ADD_UNIT, battleController.playCard);
  ws.on(TURN, battleController.passTheTurn);
  ws.on(ATTACK, battleController.attack);

  async function onDisconnect() {
    const { user } = ws;
    if (!user) return;
    await user.onDisconnect();
    ws.broadcast.emit(USER_GOES, user.name);
    logger.debug(`io:game - disconnect - ${user.name} goes`);
  }
}
