import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { grey, red } from "@material-ui/core/colors";
import { useEffect } from "react";
import { useActions } from "../../hooks/useActions";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    borderRadius: "8px",
    position: "absolute",
    width: theme.spacing(72),
    height: theme.spacing(8),
    bottom: "0%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    transition: "all 0.5s",
    color: red[400],
    backgroundColor: grey[100]
  },
}));

const Modal = () => {
  const classes = useStyles();
  const modal = useTypedSelector((store) => store.modal);
  const {unShowModal} = useActions();

  useEffect(() => {
    setTimeout(() => {
      unShowModal();
    }, 3000)
  }, [modal.show])

  return (
    <Paper className={classes.root} variant="outlined">
      {modal.text}
    </Paper>
  );
};

export default Modal;
