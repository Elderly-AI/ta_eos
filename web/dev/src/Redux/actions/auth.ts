import {Dispatch} from 'redux';
import {authAction, authAPI} from '@Redux/reducers/auth';
import {authLoginRequest} from '@data/Models';

export const authorize = (user: authLoginRequest) => {
    return (dispatch: Dispatch<authAction>) => {
        dispatch({type: authAPI.AUTHORIZE, payload: user});
    };
};

export const logOut = () => {
    return (dispatch: Dispatch<authAction>) => {
        dispatch({type: authAPI.LOG_OUT});
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
