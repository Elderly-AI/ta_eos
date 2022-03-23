import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    calcMultipleRequest,
    calcMultipleResponse,
    metricsMetricsArray,
    SearchUser,
    TemplateTemplateRequest,
    WorkItem,
} from './Models';

const host = 'http://188.35.161.40';
const apiPrefix = '/api/v1';
const apiHost = apiPrefix;

const api = {
    inside: apiHost + '/users', // ???
    user: apiHost + '/auth/get_current_user',
    register: apiHost + '/auth/register',
    login: apiHost + '/auth/login',
    searchUsers: apiHost + '/auth/search',
    math: { // Добавляем сюда новые ручки
        directCode: {
            // /api/v1/calculations/direct_code/lhigh_digits/left_code
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
    },
    kr: {
        getKR: apiHost + '/template/get_kr',
        approveKR: apiHost + '/template/approve_kr'
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
  getWork: (id: string) => Promise<WorkItem[]>,
  getKR: (name: string) => Promise<TemplateTemplateRequest>
}

export default api;
