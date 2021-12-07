import api, {ApiInterface} from "./api";
import {
    authLoginRequest,
    authRegisterRequest,
    authSafeUser,
    authUser,
    calcDirectCodeRequest,
    calcDirectCodeResponse,
} from "./Models";


class DataService implements ApiInterface {
    async curUser(): Promise<authSafeUser> {
        return await fetch(api.curUser)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .catch((err) => console.error(err))
            .then((dat: authSafeUser) => dat)
    }

    async directCodeLeftShift(data: calcDirectCodeRequest): Promise<calcDirectCodeResponse> {
        return await fetch(api.math.directCode.leftShift, {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcDirectCodeResponse) => dat)
    }

    async directCodeRightShift(data: calcDirectCodeRequest): Promise<calcDirectCodeResponse> {
        return await fetch(api.math.directCode.rightShift, {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: calcDirectCodeResponse) => dat)
    }

    async login(data: authLoginRequest): Promise<authUser> {
        return await fetch(api.login, {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: authUser) => dat)
    }

    async register(data: authRegisterRequest): Promise<authSafeUser> {
        return await fetch(api.register, {
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .catch((err) => console.error(err))
            .then((dat: authSafeUser) => dat)
    }
}


export default new DataService();
