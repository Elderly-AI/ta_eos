import api, {ApiInterface} from './api';
import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    calcMultipleRequest,
    calcMultipleResponse,
    metricsMetricsArray,
    SearchResult,
    SearchUser,
    TemplateTemplateRequest,
    WorkItem,
} from './Models';

const MOCK_KP_LIST: WorkItem[] = [
    {
        name: 'Если не справился, ты идиот',
        possibility: false,
        estimation: 'отл'
    },
    {
        name: 'Если не справился, ты идиот',
        possibility: true,
    },
    {
        name: 'Если не справился, ты идиот',
        possibility: false,
    }
] as WorkItem[];

class DataService implements ApiInterface {
    async curUser(): Promise<authSafeUser> {
        return await fetch(api.user)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .catch((err) => console.error(err))
            .then((dat: authSafeUser) => dat);
    }

    async directCodeHighLeftShift(data: calcMultipleRequest): Promise<calcMultipleResponse> {
        return await fetch(api.math.directCode.highLeftShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcMultipleResponse) => dat);
    }

    async directCodeHighRightShift(data: calcMultipleRequest): Promise<calcMultipleResponse> {
        return await fetch(api.math.directCode.highRightShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcMultipleResponse) => dat);
    }

    async directCodeLowLeftShift(data: calcMultipleRequest): Promise<calcMultipleResponse> {
        return await fetch(api.math.directCode.lowLeftShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcMultipleResponse) => dat);
    }

    async directCodeLowRightShift(data: calcMultipleRequest): Promise<calcMultipleResponse> {
        return await fetch(api.math.directCode.lowRightShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcMultipleResponse) => dat);
    }

    async additionalCodeCorrectiveStep(data: calcMultipleRequest): Promise<calcMultipleResponse> {
        return await fetch(api.math.additionalCode.correctiveStep, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcMultipleResponse) => dat);
    }

    async login(data: authLoginRequest): Promise<authSafeUser> {
        return await fetch(api.login, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: authSafeUser) => dat);
    }

    async register(data: authRegisterRequest): Promise<authSafeUser> {
        return await fetch(api.register, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: authSafeUser) => dat);
    }

    async search(text: string): Promise<Array<SearchUser>> {
        return await fetch(api.searchUsers + '?text=' + text, {
            method: 'GET'
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: SearchResult) => dat.users);
    }

    async searchTimestamp(text: string, from: string, to: string): Promise<metricsMetricsArray> {
        const url = new URL(api.admin.metrics);
        const params = {
            text: text,
            from: from,
            to: to
        };
        url.search = new URLSearchParams(params).toString();

        return await fetch(url.href)
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: metricsMetricsArray) => dat);
    }

    async searchMetric(text: string): Promise<metricsMetricsArray> {
        const url = new URL(api.admin.search);
        const params = {
            text: text,
        };
        url.search = new URLSearchParams(params).toString();

        return await fetch(url.href)
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: metricsMetricsArray) => dat);
    }

    async getWork(id: string): Promise<WorkItem[]> {
        const prom = new Promise((resolve, reject) => {
            try {
                resolve(MOCK_KP_LIST);
            } catch (e) {
                reject(e);
            }
        });

        return prom.then((res) => res as WorkItem[]);
    }

    async getKR(name: string): Promise<TemplateTemplateRequest> {
        const body = JSON.stringify({
            krName: name
        });
        return await fetch(api.kr.getKR, {
            body,
            method: 'POST'
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((res: TemplateTemplateRequest) => res);
    }

    async approveKR(name: string, data: TemplateTemplateRequest): Promise<TemplateTemplateRequest> {
        const body = JSON.stringify(data);

        return await fetch(api.kr.approveKR, {
            body,
            method: 'POST'
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((res) => ({
                ...res,
                point: res.point ?? 0
            }));
    }
}


export default new DataService();
