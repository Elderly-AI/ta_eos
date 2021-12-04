import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    authUser,
    calcDirectCodeRequest,
    calcDirectCodeResponse,
} from './Models';

const host = 'http://188.35.161.40';

const api = {
    inside: host + '/api/v1/users/', // ???
    curUser: host + '/api/v1/auth/get_current_user',
    register: host + '/api/v1/auth/register',
    login: host + '/api/v1/auth/login/',
    math: { // Добавляем сюда новые ручки
        directCode: {
            highLeftShift: host + '/api/v1/calculations/direct_code/high_digits/left_shift',
            highRightShift: host + '/api/v1/calculations/direct_code/high_digits/right_shift',
            lowLeftShift: host + '/api/v1/calculations/direct_code/low_digits/left_shift',
        },
    },
};

export interface ApiInterface {
  curUser: () => Promise<authSafeUser>,
  login: (data: authLoginRequest) => Promise<authUser>,
  register: (data: authRegisterRequest) => Promise<authSafeUser>,
  directCodeHighLeftShift: (data: calcDirectCodeRequest) => Promise<calcDirectCodeResponse>,
  directCodeHighRightShift: (data: calcDirectCodeRequest) => Promise<calcDirectCodeResponse>
}

export default api;
