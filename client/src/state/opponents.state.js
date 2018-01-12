import { opponentsApi } from "../api";

export const OPPONENTS_COME = "OPPONENTS_COME";
export const OPPONENTS_GOES = "OPPONENTS_GOES";
export const OPPONENTS_LOAD = "OPPONENTS_LOAD";

//
// ============ Reducer ============
//

export default function(state = [], { type, payload }) {
  switch (type) {
    case OPPONENTS_COME:
      return [...state, payload];
    case OPPONENTS_LOAD:
      return payload;
    case OPPONENTS_GOES:
      return state.filter(name => name !== payload);
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function opponentCome(user) {
  return dispatch => {
    dispatch(createOpponentCome(user));
  };
}

export function loadOpponents(name) {
  return async dispatch => {
    const users = await opponentsApi.loadOpponents(name);
    dispatch(createLoadOpponents(users));
  };
}

export function opponentGoes(user) {
  return dispatch => {
    dispatch(createOpponentGoes(user));
  };
}

//
// ============ Action creators ============
//

export function createOpponentCome(user) {
  return {
    type: OPPONENTS_COME,
    payload: user
  };
}

function createLoadOpponents(users) {
  return {
    type: OPPONENTS_LOAD,
    payload: users
  };
}

export function createOpponentGoes(user) {
  return {
    type: OPPONENTS_GOES,
    payload: user
  };
}
