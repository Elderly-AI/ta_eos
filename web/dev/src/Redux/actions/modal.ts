import { Dispatch } from "redux";
import { modalAction, modalAPI, IModal} from "../reducers/modal";

export const showModal = (text: string) => {
  return (dispatch: Dispatch<modalAction>) => {
    dispatch({ type: modalAPI.MODAL_SHOW, payload: text });
  };
};

export const unShowModal = () => {
  return (dispatch: Dispatch<modalAction>) => {
    dispatch({ type: modalAPI.MODAL_UNSHOW });
  };
};
