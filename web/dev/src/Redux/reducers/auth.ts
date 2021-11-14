enum authAPI {
  AUTHORIZE = "AUTHORIZE",
  LOG_OUT = "LOG_OUT",
  INSIDE = "INSIDE",
  NOT_INSIDE = "NOT_INSIDE",
}

export interface IAuth {
  id: number | null;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  group: string;
  token: string | null;
  inside?: boolean;
}

const initialState: null = null;

type authorize = {
  type: authAPI.AUTHORIZE;
  payload: IAuth;
};

type logOut = {
  type: authAPI.LOG_OUT;
};

type inside = {
  type: authAPI.INSIDE;
  payload: IAuth;
  inside: boolean;
};

type notInside = {
  type: authAPI.NOT_INSIDE;
};

export type authAction = authorize | logOut | inside | notInside;

export default function auth(
  state: IAuth | null = initialState,
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
        inside: action.inside,
      } as IAuth;
    case authAPI.NOT_INSIDE:
      return null;
    default:
      return state;
  }
}

export { authAPI };
