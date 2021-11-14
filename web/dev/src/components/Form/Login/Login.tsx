import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ChangeEvent, useState } from "react";
import URLS from "../../../config/urls";
import { useActions } from "../../../hooks/useActions";
import { IAuth } from "../../../Redux/reducers/auth";
import CustomInput, { CustomInputProps } from "../../CustomInput/CustomInput";
import { Link } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  textInputs: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

const inputs: CustomInputProps[] = [
  {
    id: "email",
    label: "Email",
    isPassword: false,
  },
  {
    id: "password",
    label: "Пароль",
    isPassword: true,
  },
];

export interface ILoginForm {
  login: string;
  password: string;
}

// const okUser: IAuth = {
//   id: 1,
//   email: "dadad",
//   name: "sa",
//   surname: "as",
//   patronymic: "sa",
//   group: "da",
// };

const Login = () => {
  const { authorize, showModal } = useActions();
  const classes = useStyles();
  const token = useTypedSelector((store) => store.auth?.token);
  const [fd, setFd] = useState<ILoginForm>({} as ILoginForm);

  const formHandler = (e: any) => {
    let headers: HeadersInit | undefined;

    if (document.cookie && token) {
      headers = {
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRFToken": token,
      };
    } else {
      headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
    }

    e.preventDefault();
    fetch(URLS.login, {
      method: "POST",
      headers,
      body: JSON.stringify(fd),
    })
      .then((res) => res.json())
      .then((json) => {
        json.token = document.cookie.split("=")[1];
        json.inside = true;
        authorize(json as IAuth);
      })
      .catch((error) => {
        showModal("Неправильно введен email или пароль");
      });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFd({ ...fd, [e?.target?.id]: e.target.value });
  };

  return (
    <form className={classes.form}>
      <div className={classes.textInputs}>
        {inputs.map((input) => (
          <CustomInput key={input.id} handler={handleChange} {...input} />
        ))}
        <Link  onClick={formHandler} to="/home">
          <Button variant="contained" color="primary">
            Вход
          </Button>
        </Link>
      </div>
    </form>
  );
};

export default Login;
