import { Dispatch } from "redux";
import { timingAction, timingENUM } from "../reducers/timing";

export const getTiming = () => {
  return (dispatch: Dispatch<timingAction>) => {
    dispatch({type: timingENUM.GET_TIMINGS, payload: []})
  };
};
