import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ChangeEvent, useState } from "react";
import URLS from "../../../config/urls";
import { IRegistrationForm } from "../Form";
import CustomInput from "../../CustomInput";
import { CustomInputProps } from "../../CustomInput/CustomInput";
import { Link } from "react-router-dom";
import { useActions } from "../../../hooks/useActions";
import auth, { IAuth } from "../../../Redux/reducers/auth";
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
  {
    id: "name",
    label: "Имя",
    isPassword: false,
  },
  {
    id: "surname",
    label: "Фамилия",
    isPassword: false,
  },
  {
    id: "patronymic",
    label: "Отчество",
    isPassword: false,
  },
  {
    id: "group",
    label: "Группа",
    isPassword: false,
  },
];

const Registration = () => {
  const classes = useStyles();
  const token = useTypedSelector((store) => store.auth?.token);
  const { authorize, showModal } = useActions();
  const [fd, setFd] = useState<IRegistrationForm>({} as IRegistrationForm);

  const formHandler = (e: any) => {
    e.preventDefault();
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

    fetch(URLS.registr, {
      method: "POST",
      headers,
      body: JSON.stringify(fd),
    })
      .then((res) => res.json())
      .then((json) => {
        json.token = document.cookie.split("=")[1];
        json.inside = true;
        return json;
      })
      .then((final) => authorize(final as IAuth))
      .catch((error) => showModal("Ошибка"));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFd({ ...fd, [e?.target?.id]: e.target.value });
  };

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <div className={classes.textInputs}>
        {inputs.map((input) => (
          <CustomInput key={input.id} handler={handleChange} {...input} />
        ))}
        <Link  onClick={formHandler} to="/home">
          <Button variant="contained" color="primary">
            Зарегистрироваться
          </Button>
        </Link>
      </div>
    </form>
  );
};

export default Registration;
