import api, {ApiInterface} from './api';
import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    authUser,
    calcDirectCodeRequest,
    calcDirectCodeResponse,
} from './Models';


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

    async directCodeHighLeftShift(data: calcDirectCodeRequest): Promise<calcDirectCodeResponse> {
        return await fetch(api.math.directCode.highLeftShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcDirectCodeResponse) => dat);
    }

    async directCodeHighRightShift(data: calcDirectCodeRequest): Promise<calcDirectCodeResponse> {
        return await fetch(api.math.directCode.highRightShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcDirectCodeResponse) => dat);
    }

    async directCodeLowLeftShift(data: calcDirectCodeRequest): Promise<calcDirectCodeResponse> {
        return await fetch(api.math.directCode.lowLeftShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcDirectCodeResponse) => dat);
    }

    async directCodeLowRightShift(data: calcDirectCodeRequest): Promise<calcDirectCodeResponse> {
        return await fetch(api.math.directCode.lowRightShift, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcDirectCodeResponse) => dat);
    }

    async login(data: authLoginRequest): Promise<authUser> {
        return await fetch(api.login, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: authUser) => dat);
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
}


export default new DataService();
