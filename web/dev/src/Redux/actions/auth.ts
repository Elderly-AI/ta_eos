import {Dispatch} from 'redux';
import {authAction, authAPI} from '../reducers/auth';
import {authLoginRequest, authRegisterRequest} from '../../data/Models';
import DataService from '../../data/DataService';

export function authorize(user: authLoginRequest) {
    return (dispatch: Dispatch<authAction>) => {
        DataService.login(user)
            .then((ok) => dispatch({type: authAPI.AUTHORIZE, payload: ok}))
            .catch((err) => console.error(err));
    };
}

export function register(user: authRegisterRequest) {
    return (dispatch: Dispatch<authAction>) => {
        DataService.register(user)
            .then((ok) => dispatch({type: authAPI.REGISTER}))
            .catch((err) => console.error(err));
    };
}

export const logOut = () => {
    return (dispatch: Dispatch<authAction>) => {
        dispatch({type: authAPI.LOG_OUT});
    };
};

export const getCurrentUser = () => {
    return (dispatch: Dispatch<authAction>) => {
        DataService.curUser()
            .then((newUser) => {
                if (newUser) {
                    return dispatch({
                        type: authAPI.GET_CURRENT_USER,
                        payload: newUser
                    });
                }
            });
    };
};

// export const authInside = () => {
//     console.log('authInside >>> ')
//     return (dispatch: Dispatch<authAction>) => {
//         fetch(api.inside).then((res) => {
//             if (res.status !== 400) {
//                 res.json().then((json) => {
//                     json.token = document.cookie.split("=")[1];
//                     dispatch({type: authAPI.INSIDE, payload: json as IAuth, inside: true})
//                 })
//                 // dispatch({ type: authAPI.INSIDE, payload: res.json() as IAuth, inside: true });
//             } else {
//                 dispatch({type: authAPI.NOT_INSIDE});
//             }
//         });
//     };
// };
