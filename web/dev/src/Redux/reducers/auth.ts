import {authSafeUser} from 'src/data/Models';

enum authAPI {
  AUTHORIZE = 'AUTHORIZE',
  LOG_OUT = 'LOG_OUT',
  GET_CURRENT_USER = 'GET_CURRENT_USER',
  NOT_INSIDE = 'NOT_INSIDE',
  REGISTER = 'REGISTER',
  SET_GRADE = 'SET_GRADE'
}

const initialState = null;

type authorize = {
  type: authAPI.AUTHORIZE;
  payload: authSafeUser;
};

type logOut = {
  type: authAPI.LOG_OUT;
};

type getCurrentUser = {
  type: authAPI.GET_CURRENT_USER;
  payload: authSafeUser;
};

type notInside = {
  type: authAPI.NOT_INSIDE;
};

type register = {
  type: authAPI.REGISTER,
  payload: authSafeUser;
}

type setGrade = {
  type: authAPI.SET_GRADE,
  payload: authSafeUser
}

export type authAction = authorize | logOut | getCurrentUser | notInside | register | setGrade;

export default function auth(
    state: authSafeUser | null = initialState,
    action: authAction
) {
    switch (action.type) {
    case authAPI.AUTHORIZE:
        return action.payload;
    case authAPI.LOG_OUT:
        return null;
    case authAPI.GET_CURRENT_USER:
        return action.payload;
    case authAPI.NOT_INSIDE:
        return state;
    case authAPI.REGISTER:
        return action.payload;
    case authAPI.SET_GRADE:
        return action.payload;
    default:
        return state;
    }
}

export {authAPI};
