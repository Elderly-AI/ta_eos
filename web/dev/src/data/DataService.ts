import api, {ApiInterface} from './api';
import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    authUser,
    calcMultipleRequest,
    calcMultipleResponse,
    SearchUser,
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
            .then((dat: Array<SearchUser>) => dat);
    }
}


export default new DataService();
