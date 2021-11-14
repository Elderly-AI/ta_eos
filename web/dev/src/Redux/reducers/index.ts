import { combineReducers } from "redux";
import timing from "./timing";
import auth from "./auth";
import modal from "./modal";

export const rootReducer = combineReducers({
  timing,
  auth,
  modal
});

export type RootState = ReturnType<typeof rootReducer>;
