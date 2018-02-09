import { createSelector } from "reselect";

export const opponentsSelector = createSelector(
  state => state.opponents,
  state => state.user.name,
  (ops, user_name) => {
    console.log(ops, user_name);
    return ops.filter(op => op.name !== user_name)
  });