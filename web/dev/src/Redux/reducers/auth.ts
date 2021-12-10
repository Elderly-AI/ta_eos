import {authSafeUser, authUser} from '../../data/Models';

enum authAPI {
    AUTHORIZE = 'AUTHORIZE',
    LOG_OUT = 'LOG_OUT',
    GET_CURRENT_USER = 'GET_CURRENT_USER',
    NOT_INSIDE = 'NOT_INSIDE',
    REGISTER = 'REGISTER'
}

const initialState = null;

type authorize = {
    type: authAPI.AUTHORIZE;
    payload: authUser;
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
    type: authAPI.REGISTER
}

export type authAction = authorize | logOut | getCurrentUser | notInside | register;

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
        return state;
    default:
        return state;
    }
}

export {authAPI};
