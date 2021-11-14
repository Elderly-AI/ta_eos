import { Dispatch } from "redux";
import URLS from "../../config/urls";
import { authAction, authAPI, IAuth } from "../reducers/auth";

export const authorize = (user: IAuth) => {
  return (dispatch: Dispatch<authAction>) => {
    console.log('from auth>>>')
    dispatch({ type: authAPI.AUTHORIZE, payload: user });
  };
};

export const logOut = () => {
  return (dispatch: Dispatch<authAction>) => {
    dispatch({ type: authAPI.LOG_OUT });
  };
};

export const authInside = () => {
  console.log('authInside >>> ')
  return (dispatch: Dispatch<authAction>) => {
    fetch(URLS.inside).then((res) => {
      if (res.status !== 400) {
        res.json().then((json) => {
          json.token = document.cookie.split("=")[1];
          dispatch({ type: authAPI.INSIDE, payload: json as IAuth, inside: true })
        })
        // dispatch({ type: authAPI.INSIDE, payload: res.json() as IAuth, inside: true });
      } else {
        dispatch({ type: authAPI.NOT_INSIDE});
      }
    });
  };
};
