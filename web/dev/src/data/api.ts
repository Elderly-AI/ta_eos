import {
  authLoginRequest,
  authRegisterRequest,
  authSafeUser,
  authUser,
  calcDirectCodeRequest,
  calcDirectCodeResponse,
} from "./Models";

const host: string = "http://188.35.161.40";

const api = {
    inside: host + "/api/v1/users/", // ???
    curUser: host + "/api/v1/auth/get_current_user",
    register: host + `/api/v1/auth/register`,
    login: host + `/api/v1/auth/login/`,
    math: { // Добавляем сюда новые ручки
        directCode: {
            leftShift: host + '/api/v1/calculations/direct_code/high_digits/left_shift',
            rightShift: host + '/api/v1/calculations/direct_code/high_digits/right_shift',
        },
    },
};

export interface ApiInterface {
  curUser: () => Promise<authSafeUser>,
  login: (data: authLoginRequest) => Promise<authUser>,
  register: (data: authRegisterRequest) => Promise<authSafeUser>,
  directCodeLeftShift: (data: calcDirectCodeRequest) => Promise<calcDirectCodeResponse>,
  directCodeRightShift: (data: calcDirectCodeRequest) => Promise<calcDirectCodeResponse>
}

export default api;
