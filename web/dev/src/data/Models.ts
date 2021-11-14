export type authUser = {
    name: string,
    email: string,
    group: string
    password: string,
}

export type authLoginRequest = {
    email: string,
    password: string,
    group: string
}

export type authRegisterRequest = {
    user: authUser
}

export type authSafeUser = {
    name: string,
    email: string,
    group: string
}

export type calcDirectCodeRequest = {
    multiplier: string,
    factor: string
}

export type calcDirectCodeResponseStep = {
    index: string,
    binDec: string,
    value: string
}

export type calcDirectCodeResponse = {
    Sequence: calcDirectCodeResponseStep[]
}

export type protobufAny = {
    type: string
}

export type rpcStatus = {
    code: number,
    message: string,
    details: protobufAny
}
