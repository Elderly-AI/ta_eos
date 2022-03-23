import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {RootState} from '../../src/Redux/reducers';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
