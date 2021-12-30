import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    calcMultipleRequest,
    calcMultipleResponse,
    metricsMetricsArray,
    SearchUser,
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
        additionalCode: {
            correctiveStep: apiHost + '/calculations/additional_code/corrective_step',
        },
    },
    admin: {
        search: apiHost + '/metrics/search',
        metrics: apiHost + '/api/v1/metrics/search_timestamp',
    }
};

export interface ApiInterface {
  curUser: () => Promise<authSafeUser>,
  login: (data: authLoginRequest) => Promise<authSafeUser>,
  register: (data: authRegisterRequest) => Promise<authSafeUser>,
  directCodeHighLeftShift: (data: calcMultipleRequest) => Promise<calcMultipleResponse>,
  directCodeHighRightShift: (data: calcMultipleRequest) => Promise<calcMultipleResponse>,
  search: (text: string) => Promise<Array<SearchUser>>,
  searchMetric: (text: string) => Promise<metricsMetricsArray>,
  searchTimestamp: (text: string, from: string, to: string) => Promise<metricsMetricsArray>
}

export default api;
