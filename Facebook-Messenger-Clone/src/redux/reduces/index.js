import { combineReducers } from "redux";

import navigationReducer from "./nav-reducer";

export const AppReducer = combineReducers({
  nav: navigationReducer
});
