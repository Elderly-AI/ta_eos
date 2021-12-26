import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    authUser,
    calcDirectCodeRequest,
    calcDirectCodeResponse,
} from './Models';

const host = 'http://188.35.161.40';
const apiPrefix = '/api/v1';
const apiHost = host + apiPrefix;

const api = {
    inside: apiHost + '/users', // ???
    user: apiHost + '/auth/get_current_user',
    register: apiHost + '/auth/register',
    login: apiHost + '/auth/login',
    searchUsers: apiHost + '/auth/search',
    math: { // Добавляем сюда новые ручки
        directCode: {
            highLeftShift: apiHost + '/calculations/direct_code/high_digits/left_shift',
            highRightShift: apiHost + '/calculations/direct_code/high_digits/right_shift',
            lowLeftShift: apiHost + '/calculations/direct_code/low_digits/left_shift',
            lowRightShift: apiHost + '/calculations/direct_code/low_digits/right_shift',
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
