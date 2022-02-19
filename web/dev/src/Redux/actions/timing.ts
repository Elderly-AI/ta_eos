import {Dispatch} from 'redux';
import {timingAction, timingENUM} from '@Redux/reducers/timing';

export const getTiming = () => {
    return (dispatch: Dispatch<timingAction>) => {
        dispatch({type: timingENUM.GET_TIMINGS, payload: []});
    };
};
