import { logger } from "../index";
import { getErrorMessage } from "../../utils/index";

export function _newBattleLog(err, res, user, opponent) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(
    `io:game - new battle between ${user.name}(${user.socketId}) and ` +
      `${opponent.name}(${opponent.socketId})`
  );
}

export function _setUserReadyLog(err, res, user) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(`io:game - user "${user.name}" ready to fight`);
}
