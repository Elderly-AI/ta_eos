import {authLoginRequest, authSafeUser} from "@data/Models";

enum authAPI {
    AUTHORIZE = "AUTHORIZE",
    LOG_OUT = "LOG_OUT",
    INSIDE = "INSIDE",
    NOT_INSIDE = "NOT_INSIDE",
}

const initialState: null = null;

type authorize = {
    type: authAPI.AUTHORIZE;
    payload: authLoginRequest;
};

type logOut = {
    type: authAPI.LOG_OUT;
};

type inside = {
    type: authAPI.INSIDE;
    payload: authSafeUser;
    inside: boolean;
};

type notInside = {
    type: authAPI.NOT_INSIDE;
};

export type authAction = authorize | logOut | inside | notInside;

export default function auth(
    state: authSafeUser | null = initialState,
    action: authAction
) {
    switch (action.type) {
        case authAPI.AUTHORIZE:
            return action.payload;
        case authAPI.LOG_OUT:
            return null;
        case authAPI.INSIDE:
            return {
                ...action.payload,
            } as authSafeUser;
        case authAPI.NOT_INSIDE:
            return null;
        default:
            return state;
    }
}

export {authAPI};
