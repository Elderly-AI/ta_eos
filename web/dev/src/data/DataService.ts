import {ApiInterface} from "./api";
import {
    authLoginRequest, authRegisterRequest,
    authSafeUser, authUser,
    calculationsDirectCodeLeftShiftRequest,
    calculationsDirectCodeLeftShiftResponse,
    calculationsDirectCodeRightShiftRequest, calculationsDirectCodeRightShiftResponse
} from "./Models";


class DataService implements ApiInterface {
    curUser(): authSafeUser {
        return undefined;
    }

    directCodeLeftShift(data: calculationsDirectCodeLeftShiftRequest): calculationsDirectCodeLeftShiftResponse {
        return undefined;
    }

    directCodeRightShift(data: calculationsDirectCodeRightShiftRequest): calculationsDirectCodeRightShiftResponse {
        return undefined;
    }

    login(data: authLoginRequest): authUser {
        return undefined;
    }

    register(data: authRegisterRequest): authSafeUser {
        return undefined;
    }
}



export default new DataService();
