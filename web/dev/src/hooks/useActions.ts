import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "@Redux/actions";

export const useActions = () => {
  const disptach = useDispatch();
  return bindActionCreators(actions, disptach);
};
