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

export type calculationsDirectCodeLeftShiftRequest = {
    multiplier: string,
    factor: string
}

export type calculationsDirectCodeLeftShiftResponseStep = {
    index: string,
    binDec: string,
    value: string
}

export type calculationsDirectCodeLeftShiftResponse = {
    Sequence: calculationsDirectCodeLeftShiftResponseStep
}

export type calculationsDirectCodeRightShiftRequest = {
    multiplier: string,
    factor: string
}

export type calculationsDirectCodeRightShiftResponse = {
    Sequence: calculationsDirectCodeRightShiftResponseStep
}

export type calculationsDirectCodeRightShiftResponseStep = {
    index: string,
    binDec: string,
    value: string
}

export type protobufAny = {
    type: string
}

export type rpcStatus = {
    code: number,
    message: string,
    details: protobufAny
}
