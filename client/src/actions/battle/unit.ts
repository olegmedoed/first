import {
  UNIT_ACTIVATE,
  UNIT_DISACTIVATE,
  UNIT_DECREASE_AVAILABILITY,
  UNIT_INCREASE_AVAILABILITY,
  UNIT_DECREASE_MOVES,
  UNIT_INCREASE_MOVES,
  ATTACK
} from ".";

//
// ============ reducer ============
//

export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case ATTACK: {
      const { target, damage } = payload;
      if (target._id !== state._id) return state;

      return { ...state, health: state.health - damage };
    }

    case UNIT_ACTIVATE: {
      const { unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, active: true };
    }

    case UNIT_DISACTIVATE: {
      const { unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, active: false };
    }

    case UNIT_INCREASE_AVAILABILITY: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, availability: state.availability + amount };
    }

    case UNIT_DECREASE_AVAILABILITY: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, availability: state.availability - amount };
    }

    case UNIT_INCREASE_MOVES: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, moves: state.moves + amount };
    }

    case UNIT_DECREASE_MOVES: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, moves: state.moves - amount };
    }

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function unitActivate(unit_id, effects) {
  return {
    type: UNIT_ACTIVATE,
    effects,
    payload: { unit_id }
  };
}

export function unitDisActivate(unit_id, effects) {
  return {
    type: UNIT_DISACTIVATE,
    effects,
    payload: { unit_id }
  };
}

export function unitAttacked(payload, effects: any[]) {
  return {
    type: ATTACK,
    effects,
    payload
  };
}

export function unitDecreaseAvailability(unit_id, amount) {
  return {
    type: UNIT_DECREASE_AVAILABILITY,
    payload: {
      amount,
      unit_id
    }
  };
}

export function unitIncreaseAvailability(unit_id, amount) {
  return {
    type: UNIT_INCREASE_AVAILABILITY,
    payload: {
      amount,
      unit_id
    }
  };
}

export function unitDecreaseMoves(unit_id, amount) {
  return {
    type: UNIT_DECREASE_MOVES,
    payload: {
      amount,
      unit_id
    }
  };
}

export function unitIncreaseMoves(unit_id, amount) {
  return {
    type: UNIT_INCREASE_MOVES,
    payload: {
      amount,
      unit_id
    }
  };
}