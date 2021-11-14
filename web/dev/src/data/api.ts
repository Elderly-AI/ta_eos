import {
  authLoginRequest,
  authRegisterRequest,
  authSafeUser,
  authUser,
  calculationsDirectCodeLeftShiftRequest,
  calculationsDirectCodeLeftShiftResponse,
  calculationsDirectCodeRightShiftRequest, calculationsDirectCodeRightShiftResponse
} from "./Models";

const port: string = "3000"; // ???

const Api = {
  inside: "api/v1/users/", // ???
  curUser: "api/v1/auth/get_current_user",
  register: `api/v1/auth/register`,
  login: `api/v1/auth/login/`,
  math: { // Добавляем сюда новые ручки
    directCode: {
      leftShift: '/api/v1/calculations/direct_code/left_shift',
      rightShift: '/api/v1/calculations/direct_code/right_shift',
    },
  },
};

export interface ApiInterface {
  curUser: () => authSafeUser,
  login: (data: authLoginRequest) => authUser,
  register: (data: authRegisterRequest) => authSafeUser,
  directCodeLeftShift: (data: calculationsDirectCodeLeftShiftRequest) => calculationsDirectCodeLeftShiftResponse,
  directCodeRightShift: (data: calculationsDirectCodeRightShiftRequest) => calculationsDirectCodeRightShiftResponse
}

export default Api;
