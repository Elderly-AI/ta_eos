import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    authUser,
    calculationsDirectCodeLeftShiftRequest,
    calculationsDirectCodeLeftShiftResponse,
    calculationsDirectCodeRightShiftRequest,
    calculationsDirectCodeRightShiftResponse
} from "./Models";

const host: string = "http://localhost:80/"

const api = {
    inside: host + "api/v1/users/", // ???
    curUser: host + "api/v1/auth/get_current_user",
    register: host + `api/v1/auth/register`,
    login: host + `api/v1/auth/login/`,
    math: { // Добавляем сюда новые ручки
        directCode: {
            leftShift: host + '/api/v1/calculations/direct_code/left_shift',
            rightShift: host + '/api/v1/calculations/direct_code/right_shift',
        },
    },
};

export interface ApiInterface {
    curUser: () => Promise<authSafeUser>,
    login: (data: authLoginRequest) => Promise<authUser>,
    register: (data: authRegisterRequest) => Promise<authSafeUser>,
    directCodeLeftShift: (data: calculationsDirectCodeLeftShiftRequest) => Promise<calculationsDirectCodeLeftShiftResponse>,
    directCodeRightShift: (data: calculationsDirectCodeRightShiftRequest) => Promise<calculationsDirectCodeRightShiftResponse>
}

export default api;
