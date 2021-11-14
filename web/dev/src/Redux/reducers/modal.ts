enum modalAPI {
  MODAL_SHOW = "MODAL_SHOW",
  MODAL_UNSHOW = "MODAL_UNSHOW",
}

export interface IModal {
  text: string;
  show: boolean;
}

const initialState: IModal = {
  text: "",
  show: false,
};

type show = {
  type: modalAPI.MODAL_SHOW;
  payload: string;
};

type unshow = {
  type: modalAPI.MODAL_UNSHOW;
};

export type modalAction = show | unshow;

export default function modal(
  state: IModal = initialState,
  action: modalAction
) {
  switch (action.type) {
    case modalAPI.MODAL_SHOW:
      return {
        text: action.payload,
        show: true,
      } as IModal;
    case modalAPI.MODAL_UNSHOW:
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
}

export { modalAPI };
